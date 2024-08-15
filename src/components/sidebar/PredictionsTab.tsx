import React, { useState, useCallback, useEffect } from 'react';
import { Player } from '../../interfaces/Player';
import { DraftSettingsInterface } from '../../interfaces/DraftSettingsInterface';
import { TeamInterface } from '../../interfaces/TeamInterface';
import { calculateTeamPick } from '../../util/PickCalculator';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import { Position } from '../../enums/Position.enum';
import './Predictions.css';
import PlayerDisplaySmall, { toCamelCase } from '../player/PlayerDisplaySmall';
import { formatNumber } from '../../util/FormatUtil';

interface PredictionsProps {
    players: Player[];
    draftSettings: DraftSettingsInterface;
    teams: TeamInterface[];
  }
  
  const PredictionsTab: React.FC<PredictionsProps> = ({ players, draftSettings, teams }) => {
    const [numPicks, setNumPicks] = useState(1);
    const [predictions, setPredictions] = useState<Player[]>([]);
    const [draftedPlayerIds, setDraftedPlayerIds] = useState<Set<number>>(new Set());
    const [teamNeeds, setTeamNeeds] = useState<Map<number, Position[]>>(new Map());
    const [selectedTab, setSelectedTab] = useState<string>('All');
    const [bestPlayers, setBestPlayers] = useState<Player[]>([]);
  
    const handleNumPicksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNumPicks(parseInt(event.target.value));
    };
  
    const handleTabChange = (tab: string) => {
      setSelectedTab(tab);
    };
  
    const makePredictions = useCallback(() => {
      console.log('Making predictions');
      const newPredictions: Player[] = [];
      
      // Reset internal states before starting calculations
      const currentDraftedPlayerIds = new Set<number>();
      const updatedTeamNeeds = new Map<number, Position[]>();
  
      // Initialize team needs
      teams.forEach(team => {
        updatedTeamNeeds.set(team.teamId, getTeamNeeds(team, draftSettings));
      });
  
      let currentPickNumber = players.filter(player => player.isDrafted || currentDraftedPlayerIds.has(player.id)).length + 1;
  
      for (let i = 0; i < numPicks; i++) {
        const teamIndex = calculateTeamPick(currentPickNumber, draftSettings.numTeams, draftSettings.thirdRoundReversal);
        const team = teams.find(t => t.teamId === teamIndex);
  
        if (team) {
          const neededPositions = updatedTeamNeeds.get(team.teamId) || [];
          const nextPlayer = findBestPlayer(players, neededPositions, draftSettings, currentDraftedPlayerIds);
  
          if (nextPlayer) {
            newPredictions.push(nextPlayer);
            currentDraftedPlayerIds.add(nextPlayer.id);
            updateTeamNeeds(team.teamId, nextPlayer, updatedTeamNeeds);
          }
        }
        currentPickNumber++;
      }
  
      setPredictions(newPredictions);
      setDraftedPlayerIds(currentDraftedPlayerIds);
      setTeamNeeds(updatedTeamNeeds);
      console.log(`Predictions made: ${JSON.stringify(newPredictions)}`);
      console.log(`Drafted player ids: ${JSON.stringify(Array.from(currentDraftedPlayerIds))}`);
      console.log(`Team needs: ${JSON.stringify(Array.from(updatedTeamNeeds.entries()))}`);
    }, [numPicks, players, teams, draftSettings]);
  
    useEffect(() => {
      makePredictions();
    }, [numPicks, players, teams, draftSettings, makePredictions]);
  
    useEffect(() => {
      const availablePlayers = players.filter(player => !player.isDrafted && !draftedPlayerIds.has(player.id));
  
      const sortedPlayers = availablePlayers
        .filter(player => 
          (selectedTab === 'All' ? player.overallRank !== 0 : player.positionalRank !== 0) &&
          (selectedTab === 'All' || player.position === selectedTab)
        )
        .sort((a, b) => 
          (selectedTab === 'All' ? a.overallRank : a.positionalRank) - (selectedTab === 'All' ? b.overallRank : b.positionalRank)
        )
        .slice(0, 3);
  
      setBestPlayers(sortedPlayers);
    }, [players, draftedPlayerIds, selectedTab]);
  
    const getTeamNeeds = (team: TeamInterface, draftSettings: DraftSettingsInterface) => {
      const needs: Position[] = [];
      const { qbSlots, wrSlots, rbSlots, teSlots, flexSlots, flexOptions } = draftSettings.teamSettings;
  
      const positionCounts = team.players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
  
      if ((positionCounts[Position.QB] || 0) < qbSlots) needs.push(Position.QB);
      if ((positionCounts[Position.WR] || 0) < wrSlots) needs.push(Position.WR);
      if ((positionCounts[Position.RB] || 0) < rbSlots) needs.push(Position.RB);
      if ((positionCounts[Position.TE] || 0) < teSlots) needs.push(Position.TE);
  
      const flexCount = flexOptions.reduce((total, pos) => total + (positionCounts[pos] || 0), 0);
      if (flexCount < flexSlots) needs.push(...flexOptions);
  
      return needs;
    };
  
    const findBestPlayer = (players: Player[], neededPositions: Position[], draftSettings: DraftSettingsInterface, currentDraftedPlayerIds: Set<number>): Player | undefined => {
      const availablePlayers = players.filter(player =>
        !player.isDrafted && 
        !currentDraftedPlayerIds.has(player.id) &&
        neededPositions.includes(player.position)
      );
  
      if (availablePlayers.length === 0) {
        return players.find(player => 
          !player.isDrafted && 
          !currentDraftedPlayerIds.has(player.id)
        );
      }
  
      const adpField = `${Platform[draftSettings.displayAdpPlatform].toLowerCase()}${toCamelCase(AdpType[draftSettings.displayAdpType])}`;
      return availablePlayers.reduce((bestPlayer, player) => {
        const currentAdp = (player.adp as any)[adpField];
        const bestAdp = (bestPlayer.adp as any)[adpField];
        return currentAdp < bestAdp ? player : bestPlayer;
      });
    };
  
    const updateTeamNeeds = (teamId: number, player: Player, updatedTeamNeeds: Map<number, Position[]>) => {
      const needs = updatedTeamNeeds.get(teamId) || [];
      const index = needs.indexOf(player.position);
      if (index !== -1) {
        needs.splice(index, 1);
        updatedTeamNeeds.set(teamId, needs);
      }
    };
  
    return (
      <div className="predictions-tab">
        <h2>Predictions</h2>
        <div className="input-section">
          <label htmlFor="numPicks">Number of Picks:</label>
          <input
            type="number"
            id="numPicks"
            value={numPicks}
            onChange={handleNumPicksChange}
            min="1"
            max="100"
          />
        </div>
        <div className="predictions-list">
          {predictions.map((player, index) => (
            <div key={index} className="prediction-item">
              <div className="team-number">
                Team {calculateTeamPick(index + 1, draftSettings.numTeams, draftSettings.thirdRoundReversal)}
              </div>
              <div className={`prediction-details ${getPlayerBackgroundClass(player.position)}`}>
                {player.firstName} {player.lastName} | {player.position} ◇ {player.teamAbbreviation} | Proj. {formatNumber(player.stats?.totalProjectedPoints)}
              </div>
            </div>
          ))}
        </div>
        <div className="best-players-section">
          <h2>Best Players Available After Predictions</h2>
          <div className="tabs">
            <button onClick={() => handleTabChange('All')} className={selectedTab === 'All' ? 'active' : ''}>All</button>
            <button onClick={() => handleTabChange(Position.QB)} className={selectedTab === Position.QB ? 'active' : ''}>QB</button>
            <button onClick={() => handleTabChange(Position.WR)} className={selectedTab === Position.WR ? 'active' : ''}>WR</button>
            <button onClick={() => handleTabChange(Position.RB)} className={selectedTab === Position.RB ? 'active' : ''}>RB</button>
            <button onClick={() => handleTabChange(Position.TE)} className={selectedTab === Position.TE ? 'active' : ''}>TE</button>
          </div>
          <div className="best-players-list">
            {bestPlayers.map(player => (
              <PlayerDisplaySmall
                key={player.id}
                player={player}
                adpType={draftSettings.displayAdpType}
                platform={draftSettings.displayAdpPlatform}
                hideDrafted={false}
                onFavoriteToggle={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

const getPlayerBackgroundClass = (position: Position) => {
  switch (position) {
    case Position.QB:
      return 'qb-background';
    case Position.WR:
      return 'wr-background';
    case Position.RB:
      return 'rb-background';
    case Position.TE:
      return 'te-background';
    default:
      return 'other-background';
  }
};

export default PredictionsTab;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DraftBoard from './components/tabs/DraftBoard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DraftSettings from './components/tabs/DraftSettings';
import Teams from './components/tabs/Teams';
import Tiers from './components/tabs/Tiers';
import MainNavbar from './components/navigation/MainNavBar';
import MainSidebar from './components/sidebar/MainSidebar';
import './App.css';
import { Player } from './interfaces/Player';
import { BACKEND_URL } from './util/constants';
import { AdpType } from './enums/AdpType.enum';
import { Platform } from './enums/Platform.enum';
import { DraftSettingsInterface } from './interfaces/DraftSettingsInterface';
import { Position } from './enums/Position.enum';
import { ScoringSettingInterface } from './interfaces/ScoringSettingInterface';
import { TeamInterface } from './interfaces/TeamInterface';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { formatPickNumber } from './util/PickCalculator';
import { toCamelCase } from './components/player/PlayerDisplaySmall';

const initialDraftSettings: DraftSettingsInterface = {
  numTeams: 12,
  myTeam: 12,
  numRounds: 15,
  thirdRoundReversal: true,
  displayAdpType: AdpType.PPR,
  displayAdpPlatform: Platform.SLEEPER,
  scoringSettings: [],
  teamSettings: {
    qbSlots: 1,
    wrSlots: 2,
    rbSlots: 2,
    teSlots: 1,
    flexSlots: 2,
    flexOptions: [Position.WR, Position.RB, Position.TE],
    benchSlots: 7,
  },
};

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftSettings, setDraftSettings] = useState<DraftSettingsInterface>(initialDraftSettings);
  const [updating, setUpdating] = useState(false);
  const [teams, setTeams] = useState<TeamInterface[]>([]);

  const updatePlayersWithFormattedPickNumber = (players: Player[], numTeams: number) => {
    const updatedPlayers = players.map(player => {
      const adpField = `${Platform[draftSettings.displayAdpPlatform].toLowerCase()}${toCamelCase(AdpType[draftSettings.displayAdpType])}`;
      const adpValue = (player.adp as any)[adpField];
      const pickNumber = Math.floor(adpValue);
      return {
        ...player,
        formattedPickNumber: formatPickNumber(pickNumber, numTeams),
      };
    });
    return updatedPlayers;
  };

  const handleFavoriteToggle = async (playerId: number) => {
    const updatedPlayers = players.map(player =>
        player.id === playerId
            ? { ...player, isSleeper: !player.isSleeper }
            : player
    );
    setPlayers(updatedPlayers);
    const updatedPlayer = updatedPlayers.find(player => player.id === playerId);
    if (!updatedPlayer) return;
    const payload = [
        {
            id: updatedPlayer.id,
            isSleeper: updatedPlayer.isSleeper
        }
    ];

    try {
        const response = await fetch(`${BACKEND_URL}/players/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to update favorite status');
        }
    } catch (error) {
        console.error('Error updating favorite status:', error);
    }
};


  useEffect(() => {
    axios.get<Player[]>(BACKEND_URL + '/players')
      .then(response => {
        const playersWithFormattedPickNumber = updatePlayersWithFormattedPickNumber(response.data, draftSettings.numTeams);
        setPlayers(playersWithFormattedPickNumber);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });

    axios.get<ScoringSettingInterface[]>(BACKEND_URL + '/scoring/settings')
      .then(response => {
        setDraftSettings(prevSettings => ({
          ...prevSettings,
          scoringSettings: response.data,
        }));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const newTeams: TeamInterface[] = Array.from({ length: draftSettings.numTeams }, (_, index) => ({
      teamId: index + 1,
      players: []
    }));
    setTeams(currentTeams => {
      const updatedTeams = newTeams.map(newTeam => {
        const existingTeam = currentTeams.find(team => team.teamId === newTeam.teamId);
        return {
          ...newTeam,
          players: existingTeam ? existingTeam.players : []
        };
      });
      return updatedTeams;
    });
  }, [draftSettings.numTeams]);

  useEffect(() => {
    if (players.length > 0) {
      const updatedPlayers = updatePlayersWithFormattedPickNumber(players, draftSettings.numTeams);
      setPlayers(updatedPlayers);
    }
  }, [draftSettings.displayAdpType, draftSettings.displayAdpPlatform, draftSettings.numTeams]);

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
    setTeams(currentTeams =>
      currentTeams.map(team => ({
        ...team,
        players: team.players.map(player =>
          player.id === updatedPlayer.id ? updatedPlayer : player
        )
      }))
    );
  };

  const handleUpdateDraftSettings = (updatedSettings: DraftSettingsInterface) => {
    const settingsChanged = JSON.stringify(draftSettings.scoringSettings) !== JSON.stringify(updatedSettings.scoringSettings);

    if (settingsChanged) {
      setUpdating(true);

      const scoringSettingsPayload = updatedSettings.scoringSettings.map(setting => ({
        scoringSettingId: setting.id,
        pointValue: setting.pointValue,
      }));

      axios.post<Player[]>(`${BACKEND_URL}/scoring/update?returnPlayers=true`, scoringSettingsPayload)
        .then(response => {
          const playersWithFormattedPickNumber = updatePlayersWithFormattedPickNumber(response.data, updatedSettings.numTeams);
          setPlayers(playersWithFormattedPickNumber);
          setUpdating(false);
        })
        .catch(error => {
          console.error(error);
          setUpdating(false);
        });
    }

    setDraftSettings(updatedSettings);
  };

  if (loading || updating) {
    return (
      <div className="loading-container">
        <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        <MainNavbar players={players} onUpdatePlayer={handleUpdatePlayer} />
        <div className="main-layout">
          <MainSidebar players={players} loading={loading} adpType={draftSettings.displayAdpType} platform={draftSettings.displayAdpPlatform} onFavoriteToggle={handleFavoriteToggle}/>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DraftBoard players={players} />} />
              <Route path="/draft-settings" element={<DraftSettings draftSettings={draftSettings} onSave={handleUpdateDraftSettings} />} />
              <Route path="/teams" element={<Teams teams={teams} draftSettings={draftSettings} />} />
              <Route 
                path="/tiers" 
                element={
                  <Tiers 
                    players={players} 
                    adpType={draftSettings.displayAdpType} 
                    platform={draftSettings.displayAdpPlatform}
                    onUpdatePlayer={handleUpdatePlayer}
                    setPlayers={setPlayers}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                } 
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
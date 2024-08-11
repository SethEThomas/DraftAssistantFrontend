import React, { useState } from 'react';
import PositionalTiers from './tiers/PositionalTiers';
import './tiers/Tiers.css';
import { Player } from '../../interfaces/Player';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import { Position } from '../../enums/Position.enum';
import { BACKEND_URL } from '../../util/constants';

interface TiersProps {
  players: Player[];
  adpType: AdpType;
  platform: Platform;
  onUpdatePlayer: (player: Player) => void;
  setPlayers: (players: Player[]) => void;
  onFavoriteToggle: (playerId: number) => void;
}

const Tiers: React.FC<TiersProps> = ({ players, adpType, platform, onUpdatePlayer, setPlayers, onFavoriteToggle }) => {
  const [isLocked, setIsLocked] = useState(true);

  const toggleLock = async () => {
    setIsLocked(!isLocked);
    const overallTierUpdates = players
      .filter(player => player.overallTier > 0)
      .map(player => ({
        playerId: player.id,
        tierType: Position.OVERALL,
        tier: player.overallTier
      }));
    const positionalTierUpdates = players
      .filter(player => player.positionalTier > 0)
      .map(player => ({
        playerId: player.id,
        tierType: player.position,
        tier: player.positionalTier
      }));
      const overallRankUpdates = players
      .filter(player => player.overallTier > 0)
      .map(player => ({
        playerId: player.id,
        rankType: Position.OVERALL,
        rank: player.overallRank
      }));
    const positionalRankUpdates = players
      .filter(player => player.positionalTier > 0)
      .map(player => ({
        playerId: player.id,
        rankType: player.position,
        rank: player.positionalRank
      }));

    try {
      const updateTiersUrl = `${BACKEND_URL}/players/update-tiers`;
      const updateRanksUrl = `${BACKEND_URL}/players/update-ranks`
      if (overallTierUpdates.length > 0) {
        fetch(updateTiersUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(overallTierUpdates),
        });
      }
      if (positionalTierUpdates.length > 0) {
        fetch(updateTiersUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(positionalTierUpdates),
        });
      }
        if (overallRankUpdates.length > 0) {
          fetch(updateRanksUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(overallRankUpdates),
          });
        }
        if (positionalTierUpdates.length > 0) {
          fetch(updateRanksUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(positionalRankUpdates),
          });
        }
    } catch (error) {
      console.error('Error updating tiers:', error);
    }
  };

  return (
    <div className="tiers-container">
      <button className="lock-button" onClick={toggleLock}>
        {isLocked ? '🔒' : '🔓'}
      </button>
      <PositionalTiers 
        players={players} 
        position={Position.OVERALL} 
        adpType={adpType} 
        platform={platform} 
        isLocked={isLocked}
        onUpdatePlayer={onUpdatePlayer}
        setPlayers={setPlayers}
        onFavoriteToggle={onFavoriteToggle}
      />
      <PositionalTiers 
        players={players} 
        position={Position.QB} 
        adpType={adpType} 
        platform={platform} 
        isLocked={isLocked}
        onUpdatePlayer={onUpdatePlayer}
        setPlayers={setPlayers}
        onFavoriteToggle={onFavoriteToggle}
      />
      <PositionalTiers 
        players={players} 
        position={Position.WR} 
        adpType={adpType} 
        platform={platform} 
        isLocked={isLocked}
        onUpdatePlayer={onUpdatePlayer}
        setPlayers={setPlayers}
        onFavoriteToggle={onFavoriteToggle}
      />
      <PositionalTiers 
        players={players} 
        position={Position.RB} 
        adpType={adpType} 
        platform={platform} 
        isLocked={isLocked}
        onUpdatePlayer={onUpdatePlayer}
        setPlayers={setPlayers}
        onFavoriteToggle={onFavoriteToggle}
      />
      <PositionalTiers 
        players={players} 
        position={Position.TE} 
        adpType={adpType} 
        platform={platform} 
        isLocked={isLocked}
        onUpdatePlayer={onUpdatePlayer}
        setPlayers={setPlayers}
        onFavoriteToggle={onFavoriteToggle}
      />
    </div>
  );
};

export default Tiers;

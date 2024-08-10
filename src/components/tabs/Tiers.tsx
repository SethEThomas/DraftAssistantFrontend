import React, { useState } from 'react';
import PositionalTiers from './tiers/PositionalTiers';
import './tiers/Tiers.css';
import { Player } from '../../interfaces/Player';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import { Position } from '../../enums/Position.enum';

interface TiersProps {
  players: Player[];
  adpType: AdpType;
  platform: Platform;
  onUpdatePlayer: (player: Player) => void;
}

const Tiers: React.FC<TiersProps> = ({ players, adpType, platform, onUpdatePlayer }) => {
  const [isLocked, setIsLocked] = useState(true);

  const toggleLock = () => {
    setIsLocked(!isLocked);
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
      />
      <PositionalTiers 
        players={players} 
        position={Position.QB} 
        adpType={adpType} 
        platform={platform} 
        isLocked={isLocked}
        onUpdatePlayer={onUpdatePlayer}
      />
      <PositionalTiers 
        players={players} 
        position={Position.WR} 
        adpType={adpType} 
        platform={platform} 
        isLocked={isLocked}
        onUpdatePlayer={onUpdatePlayer}
      />
      <PositionalTiers 
        players={players} 
        position={Position.RB} 
        adpType={adpType} 
        platform={platform} 
        isLocked={isLocked}
        onUpdatePlayer={onUpdatePlayer}
      />
      <PositionalTiers 
        players={players} 
        position={Position.TE} 
        adpType={adpType} 
        platform={platform} 
        isLocked={isLocked}
        onUpdatePlayer={onUpdatePlayer}
      />
    </div>
  );
};

export default Tiers;

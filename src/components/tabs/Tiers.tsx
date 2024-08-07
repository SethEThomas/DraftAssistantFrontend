import React from 'react';
import PositionalTiers from './tiers/PositionalTiers';
import './tiers/Tiers.css';
import { Player } from '../../interfaces/Player';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';

interface TiersProps {
  players: Player[];
  adpType: AdpType;
  platform: Platform;
}

const Tiers: React.FC<TiersProps> = ({ players, adpType, platform }) => {
  return (
    <div className="tiers-container">
      <PositionalTiers title="Overall" players={players} filterByPosition={null} adpType={adpType} platform={platform} />
      <PositionalTiers title="QB" players={players} filterByPosition="QB" adpType={adpType} platform={platform} />
      <PositionalTiers title="WR" players={players} filterByPosition="WR" adpType={adpType} platform={platform} />
      <PositionalTiers title="RB" players={players} filterByPosition="RB" adpType={adpType} platform={platform} />
      <PositionalTiers title="TE" players={players} filterByPosition="TE" adpType={adpType} platform={platform} />
    </div>
  );
};

export default Tiers;
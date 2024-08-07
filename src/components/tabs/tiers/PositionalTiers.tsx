import { platform } from "os";
import { AdpType } from "../../../enums/AdpType.enum";
import { Platform } from "../../../enums/Platform.enum";
import { Player } from "../../../interfaces/Player";
import IndividualTier from "./IndividualTier";
import './Tiers.css';

interface PositionalTiersProps {
    title: string;
    players: Player[];
    filterByPosition: string | null;
    adpType: AdpType;
    platform: Platform;
  }
  
  const PositionalTiers: React.FC<PositionalTiersProps> = ({ title, players, filterByPosition, adpType, platform }) => {
    const filteredPlayers = filterByPosition
      ? players.filter(player => player.position === filterByPosition)
      : players;
  
    const groupedByTier: Record<string, Player[]> = filteredPlayers.reduce((acc, player) => {
      let tier;
      
      if (filterByPosition) {
        tier = player.positionalTier;
      } else {
        tier = player.overallTier;
      }
  
      if (tier < 1) {
        tier = 'Untiered';
      } else {
        tier = `Tier ${tier}`;
      }
  
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(player);
      return acc;
    }, {} as Record<string, Player[]>);
  
    return (
      <div className="positional-tiers">
        <h2>{title}</h2>
        {Object.keys(groupedByTier).map((tier) => (
          <IndividualTier 
            key={tier} 
            tier={tier} 
            players={groupedByTier[tier]} 
            adpType={adpType} 
            platform={platform} 
          />
        ))}
      </div>
    );
  };
  
  export default PositionalTiers;
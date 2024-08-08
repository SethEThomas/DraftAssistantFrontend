import { AdpType } from "../../../enums/AdpType.enum";
import { Platform } from "../../../enums/Platform.enum";
import { Player } from "../../../interfaces/Player";
import IndividualTier from "./IndividualTier";
import './Tiers.css';
import { Position } from "../../../enums/Position.enum";
import { Tier } from "../../../interfaces/TierInterface";
import { useState, useEffect } from "react";

interface PositionalTiersProps {
  players: Player[];
  position: Position;
  adpType: AdpType;
  platform: Platform;
  isLocked: boolean;
}

const defaultTiers: Tier[] = [
  {
    tierName: "Untiered",
    tierNumber: 0,
    players: []
  }
];

const PositionalTiers: React.FC<PositionalTiersProps> = ({ players, position, adpType, platform, isLocked }) => {
  const [tiers, setTiers] = useState<Tier[]>(defaultTiers);

  useEffect(() => {
    const filteredPlayers = position !== Position.OVERALL
      ? players.filter(player => player.position === position)
      : players;
    const groupedTiers: Tier[] = [];
    const findOrCreateTier = (tierNumber: number, tierName: string) => {
      let tier = groupedTiers.find(t => t.tierNumber === tierNumber);
      if (!tier) {
        tier = { tierName, tierNumber, players: [] };
        groupedTiers.push(tier);
      }
      return tier;
    };
    filteredPlayers.forEach(player => {
      let tierNumber: number;
      let tierName: string;

      if (position === Position.OVERALL) {
        tierNumber = player.overallTier;
      } else {
        tierNumber = player.positionalTier;
      }

      if (tierNumber > 0) {
        tierName = `Tier ${tierNumber}`;
      } else {
        tierNumber = 0;
        tierName = "Untiered";
      }

      const tier = findOrCreateTier(tierNumber, tierName);
      tier.players.push(player);
    });
    setTiers(groupedTiers);
  }, [players, position]);

  const addTier = () => {
    const maxTierNumber = tiers.reduce((max, tier) => {
      return tier.tierNumber > max ? tier.tierNumber : max;
    }, 0);
  
    const newTier: Tier = {
      tierName: `Tier ${maxTierNumber + 1}`,
      tierNumber: maxTierNumber + 1,
      players: []
    };
    setTiers([...tiers, newTier]);
  };

  return (
    <div className="positional-tiers">
      <h2>{position}</h2>
      {tiers
        .filter((tier) => tier.tierNumber !== 0)
        .map((tier) => (
          <IndividualTier 
            key={tier.tierNumber} 
            tier={tier} 
            adpType={adpType} 
            platform={platform} 
          />
        ))
      }
      {!isLocked && (
        <div className="add-tier-container">
          <div className="add-tier-text" onClick={addTier}>
            Add Tier +
          </div>
        </div>
      )}
      {tiers
        .filter((tier) => tier.tierNumber === 0)
        .map((tier) => (
          <IndividualTier 
            key={tier.tierNumber} 
            tier={tier} 
            adpType={adpType} 
            platform={platform} 
          />
        ))
      }
    </div>
  );
};

export default PositionalTiers;

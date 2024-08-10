import { AdpType } from "../../../enums/AdpType.enum";
import { Platform } from "../../../enums/Platform.enum";
import { Player } from "../../../interfaces/Player";
import IndividualTier from "./IndividualTier";
import './Tiers.css';
import { Position } from "../../../enums/Position.enum";
import { Tier } from "../../../interfaces/TierInterface";
import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";


interface PositionalTiersProps {
  players: Player[];
  position: Position;
  adpType: AdpType;
  platform: Platform;
  isLocked: boolean;
  onUpdatePlayer: (player: Player) => void;
}

const defaultTiers: Tier[] = [
  {
    tierName: "Untiered",
    tierNumber: 0,
    players: []
  }
];

const PositionalTiers: React.FC<PositionalTiersProps> = ({ players, position, adpType, platform, isLocked, onUpdatePlayer }) => {
  const [tiers, setTiers] = useState<Tier[]>(defaultTiers);
  const [activeId, setActiveId] = useState(-1);

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
        return;
    }

    const overTierNumber = over.data?.current?.tierNumber;
    const overTier = tiers.find(tier => tier.tierNumber === overTierNumber);

    if (overTier) {
        const activePlayer = players.find(player => player.id === active.id);

        if (activePlayer) {
            const updatedPlayer = position === Position.OVERALL
                ? { ...activePlayer, overallTier: overTier.tierNumber }
                : { ...activePlayer, positionalTier: overTier.tierNumber };

            onUpdatePlayer(updatedPlayer);
        }
    }
};


  return (
    <div className="positional-tiers">
      <h2>{position}</h2>

      {isLocked ? (
        tiers
          .filter((tier) => tier.tierNumber !== 0 && tier.players.length > 0)
          .map((tier) => (
            <IndividualTier 
              key={tier.tierNumber} 
              tier={tier} 
              adpType={adpType} 
              platform={platform} 
            />
          ))
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <SortableContext items={tiers.filter(tier => tier.tierNumber !== 0).flatMap(tier => tier.players.map(player => player.id))} strategy={verticalListSortingStrategy}>
            {tiers
              .filter((tier) => tier.tierNumber !== 0)
              .map((tier) => (
                <IndividualTier 
                  key={tier.tierNumber} 
                  tier={tier} 
                  adpType={adpType} 
                  platform={platform}
                />
              ))}
          </SortableContext>

          <div className="add-tier-container">
            <div className="add-tier-text" onClick={addTier}>
              Add Tier +
            </div>
          </div>

          <SortableContext items={tiers.find(tier => tier.tierNumber === 0)?.players.map(player => player.id) || []} strategy={verticalListSortingStrategy}>
            {tiers
              .filter((tier) => tier.tierNumber === 0)
              .map((tier) => (
                <IndividualTier 
                  key={tier.tierNumber} 
                  tier={tier} 
                  adpType={adpType} 
                  platform={platform}
                />
              ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default PositionalTiers;

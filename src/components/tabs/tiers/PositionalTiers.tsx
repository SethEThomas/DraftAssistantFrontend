import { AdpType } from "../../../enums/AdpType.enum";
import { Platform } from "../../../enums/Platform.enum";
import { Player } from "../../../interfaces/Player";
import IndividualTier from "./IndividualTier";
import './Tiers.css';
import { Position } from "../../../enums/Position.enum";
import { Tier } from "../../../interfaces/TierInterface";
import { useState, useEffect } from "react";
import { Active, CollisionDetection, DndContext, DragEndEvent, DragOverlay, DragStartEvent, Over, closestCenter, closestCorners, rectIntersection } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { DroppableType } from "../../../enums/DroppableType.enum";


interface PositionalTiersProps {
  players: Player[];
  position: Position;
  adpType: AdpType;
  platform: Platform;
  isLocked: boolean;
  onUpdatePlayer: (player: Player) => void;
  setPlayers: (players: Player[]) => void;
  onFavoriteToggle: (playerId: number) => void;
}

const defaultTiers: Tier[] = [
  {
    tierName: "Untiered",
    tierNumber: 0,
    players: []
  }
];

const fixCursorSnapOffset: CollisionDetection = (args) => {
  if (!args.pointerCoordinates) {
    return rectIntersection(args);
  }
  const { x, y } = args.pointerCoordinates;
  const { width, height } = args.collisionRect;
  const updated = {
    ...args,
    collisionRect: {
      width,
      height,
      bottom: y + height / 2,
      left: x - width / 2,
      right: x + width / 2,
      top: y - height / 2,
    },
  };
  return rectIntersection(updated);
};

const getDraggableIdAndType = (id: string): { type: DroppableType, id: number } => {
  const [prefix, idString] = id.split('-');
  const calculatedId = parseInt(idString, 10);

  let type: DroppableType;

  switch (prefix.toLowerCase()) {
    case 'player':
      type = DroppableType.PLAYER;
      break;
    case 'tier':
      type = DroppableType.TIER;
      break;
    default:
      throw new Error(`Unknown prefix: ${prefix}`);
  }

  return { type, id: calculatedId };
};

const PositionalTiers: React.FC<PositionalTiersProps> = ({ players, position, adpType, platform, isLocked, onUpdatePlayer, setPlayers, onFavoriteToggle }) => {
  const DraggableItem = ({ fullId }: { fullId: string }) => {
    const {type, id} = getDraggableIdAndType(fullId);
    const player = players.find(p => p.id === id);
    return player ? (
      <div className="drag-overlay">
        {player.firstName} {player.lastName}
      </div>
    ) : null;
  };
  const [tiers, setTiers] = useState<Tier[]>(defaultTiers);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const filteredPlayers = position !== Position.OVERALL
      ? players.filter(player => player.position === position)
      : players;

    const groupedTiers: { [key: number]: Tier } = {};

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

      if (!groupedTiers[tierNumber]) {
        groupedTiers[tierNumber] = { tierName, tierNumber, players: [] };
      }

      groupedTiers[tierNumber].players.push(player);
    });

    const maxTierNumber = Math.max(...Object.keys(groupedTiers).map(Number), 0);
    for (let i = 1; i <= maxTierNumber; i++) {
      if (!groupedTiers[i]) {
        groupedTiers[i] = { tierName: `Tier ${i}`, tierNumber: i, players: [] };
      }
    }
    const sortedTiers = Object.values(groupedTiers).sort((a, b) => a.tierNumber - b.tierNumber);

    setTiers(sortedTiers);
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
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
        return;
    }
    const { id: activeId } = getDraggableIdAndType(active.id as string);
    const { type: overType, id: overId } = getDraggableIdAndType(over.id as string);
    if(overType === DroppableType.TIER){
      doTierUpdate(active, over, activeId);
    }
    else if(overType === DroppableType.PLAYER){
      doPlayerUpdate(activeId, overId);
    }
    else{
      console.log(`Player dropped over undroppable location`);
    }
    setActiveId(null);
  };

  const doTierUpdate = (active: Active, over: Over, activeId: number): void => {
    const overTierNumber = over.data?.current?.tierNumber;
    const overTier = tiers.find(tier => tier.tierNumber === overTierNumber);
    
    if (overTier) {
      const activePlayer = players.find(player => player.id === activeId);
  
      if (activePlayer) {
        const currentTierIndex = tiers.findIndex(tier => tier.tierNumber === overTierNumber);
        const rankField: keyof Player = position === Position.OVERALL ? 'overallRank' : 'positionalRank';
        const currentRank = activePlayer[rankField];
        let newRank: number;
  
        if (overTier.players.length > 0) {
          const highestRankInOverTier = Math.max(...overTier.players.map(player => player[rankField] as number));
          newRank = highestRankInOverTier + 1;
        } else {
          let tierAbove = null;
          for (let i = currentTierIndex - 1; i >= 0; i--) {
            if (tiers[i].players.length > 0) {
              tierAbove = tiers[i];
              break;
            }
          }
          let tierBelow = null;
          for (let i = currentTierIndex + 1; i < tiers.length; i++) {
            if (tiers[i].players.length > 0) {
              tierBelow = tiers[i];
              break;
            }
          }
  
          if (tierAbove) {
            const highestRankInTierAbove = Math.max(...tierAbove.players.map(player => player[rankField] as number));
            newRank = currentRank === highestRankInTierAbove ? currentRank : highestRankInTierAbove + 1;
          } else if (tierBelow) {
            const lowestRankInTierBelow = Math.min(...tierBelow.players.map(player => player[rankField] as number));
            newRank = currentRank === lowestRankInTierBelow ? currentRank : lowestRankInTierBelow - 1 ;
          } else {
            newRank = 1;
          }
        }
  
        const updatedPlayer = position === Position.OVERALL
          ? { ...activePlayer, overallTier: overTierNumber, overallRank: newRank }
          : { ...activePlayer, positionalTier: overTierNumber, positionalRank: newRank };
  
        onUpdatePlayer(updatedPlayer);
      }
    }
  };
  




  const doPlayerUpdate = (activeId: number, overId: number): void => {
    const activePlayer = players.find(player => player.id === activeId) || null;
    const overPlayer = players.find(player => player.id === overId) || null;
    if(activePlayer && overPlayer){
      if(position === Position.OVERALL){
        activePlayer.overallTier = overPlayer.overallTier;
      }
      else{
        activePlayer.positionalTier = overPlayer.positionalTier;
      }
      const activePlayerRank = position === Position.OVERALL ? activePlayer.overallRank : activePlayer.positionalRank;
      const overPlayerRank = position === Position.OVERALL ? overPlayer.overallRank : overPlayer.positionalRank;
      if(overPlayerRank === 0) return;
      if(activePlayerRank > overPlayerRank || activePlayerRank === 0){
        movePlayerUp(activePlayer, overPlayer);
      }
      else{
        movePlayerDown(activePlayer, overPlayer);
      }
    }
  }

  const movePlayerUp = (activePlayer: Player, overPlayer: Player): void => {
    const updatedPlayers = players.map(player => {
        let rankField: keyof Player;
        if (position === Position.OVERALL) {
            rankField = "overallRank";
        } else {
            rankField = "positionalRank";
        }

        if (player.id === activePlayer.id) {
            return { ...player, [rankField]: overPlayer[rankField] };
        } else if (
            player[rankField] >= overPlayer[rankField] &&
            player[rankField] < (activePlayer[rankField] === 0 ? 9999 : activePlayer[rankField])
        ) {
            return { ...player, [rankField]: player[rankField] + 1 };
        }
        return player;
    });

    setPlayers(updatedPlayers);
  };

const movePlayerDown = (activePlayer: Player, overPlayer: Player): void => {
    const updatedPlayers = players.map(player => {
        let rankField: keyof Player;
        if (position === Position.OVERALL) {
            rankField = "overallRank";
        } else {
            rankField = "positionalRank";
        }

        if (player.id === activePlayer.id) {
            return { ...player, [rankField]: overPlayer[rankField] };
        } else if (
            player[rankField] <= overPlayer[rankField] &&
            player[rankField] > (activePlayer[rankField] === 0 ? 9999 : activePlayer[rankField])
        ) {
            return { ...player, [rankField]: player[rankField] - 1 };
        }
        return player;
    });

    setPlayers(updatedPlayers);
};


  
  return (
    <div className="positional-tiers">
      <h2>{position}</h2>

      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        autoScroll={{layoutShiftCompensation: false, threshold: { x: 0, y: 0.05 }}}
      >
        {isLocked ? (
          tiers
            .filter((tier) => tier.tierNumber !== 0 && tier.players.length > 0)
            .map((tier) => (
              <IndividualTier 
                key={tier.tierNumber} 
                tier={tier} 
                adpType={adpType} 
                platform={platform}
                position={position}
                onFavoriteToggle={onFavoriteToggle}
              />
            ))
        ) : (
          <>
            <SortableContext
              items={tiers.filter(tier => tier.tierNumber !== 0).flatMap(tier => tier.players.map(player => player.id))}
              strategy={verticalListSortingStrategy}
            >
              {tiers
                .filter((tier) => tier.tierNumber !== 0)
                .map((tier) => (
                  <IndividualTier 
                    key={tier.tierNumber} 
                    tier={tier} 
                    adpType={adpType} 
                    platform={platform}
                    position={position}
                    onFavoriteToggle={onFavoriteToggle}
                  />
                ))}
            </SortableContext>

            <div className="add-tier-container">
              <div className="add-tier-text" onClick={addTier}>
                Add Tier +
              </div>
            </div>

            <SortableContext
              items={tiers.find(tier => tier.tierNumber === 0)?.players.map(player => player.id) || []}
              strategy={verticalListSortingStrategy}
            >
              {tiers
                .filter((tier) => tier.tierNumber === 0)
                .map((tier) => (
                  <IndividualTier 
                    key={tier.tierNumber} 
                    tier={tier} 
                    adpType={adpType} 
                    platform={platform}
                    position={position}
                    onFavoriteToggle={onFavoriteToggle}
                  />
                ))}
            </SortableContext>
          </>
        )}

        <DragOverlay modifiers={[snapCenterToCursor]}>
          {activeId ? <DraggableItem fullId={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default PositionalTiers;

function createSnapModifier(gridSize: number) {
  throw new Error("Function not implemented.");
}

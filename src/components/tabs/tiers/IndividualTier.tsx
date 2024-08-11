import { useEffect, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { AdpType } from "../../../enums/AdpType.enum";
import { Platform } from "../../../enums/Platform.enum";
import { Tier } from "../../../interfaces/TierInterface";
import PlayerDisplaySmall from "../../player/PlayerDisplaySmall";
import './Tiers.css';
import { Position } from "../../../enums/Position.enum";

interface IndividualTierProps {
    tier: Tier;
    adpType: AdpType;
    platform: Platform;
    position: Position;
    onFavoriteToggle: (playerId: number) => void;
}

const IndividualTier: React.FC<IndividualTierProps> = ({ tier, adpType, platform, position, onFavoriteToggle }) => {
    const isThrottled = useRef(false);
    const unlockTimeout = useRef<NodeJS.Timeout | null>(null);
    const isEmpty = tier.players.length === 0;
    const isDroppable = tier.tierNumber >= 1;

    const { setNodeRef, isOver } = useDroppable({
        id: `tier-${tier.tierNumber}`,
        data: {
            tierNumber: tier.tierNumber
        },
        disabled: !isDroppable 
    });

    const dropClass = isOver ? (isEmpty ? 'over-empty' : 'over-non-empty') : '';
    const sortedPlayers = [...tier.players].sort((a, b) => {
        if (position === Position.OVERALL) {
            return a.overallRank - b.overallRank;
        } else {
            return a.positionalRank - b.positionalRank;
        }
    });

    useEffect(() => {
        const lockScroll = () => {
            if (isOver && isEmpty) {
                document.body.classList.add('lock-scroll');
            } else {
                unlockTimeout.current = setTimeout(() => {
                    document.body.classList.remove('lock-scroll');
                }, 1000);
            }
        };

        if (!isThrottled.current) {
            lockScroll();
            isThrottled.current = true;

            setTimeout(() => {
                isThrottled.current = false;
            }, 1000);
        }

        return () => {
            if (unlockTimeout.current) {
                clearTimeout(unlockTimeout.current);
            }
            document.body.classList.remove('lock-scroll');
        };
    }, [isOver, isEmpty]);

    return (
        <div className={`individual-tier ${dropClass}`} ref={isDroppable ? setNodeRef : null}>
            <h3>{tier.tierName}</h3>
            {isEmpty ? (
                <div className="empty-tier-placeholder">Drag players to add</div>
            ) : (
                <ul>
                    {sortedPlayers.map(player => (
                        <li key={player.id}>
                            <PlayerDisplaySmall
                                player={player}
                                adpType={adpType}
                                platform={platform}
                                onFavoriteToggle={onFavoriteToggle}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default IndividualTier;

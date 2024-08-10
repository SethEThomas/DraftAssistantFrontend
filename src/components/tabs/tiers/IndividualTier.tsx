import { useDroppable } from "@dnd-kit/core";
import { AdpType } from "../../../enums/AdpType.enum";
import { Platform } from "../../../enums/Platform.enum";
import { Tier } from "../../../interfaces/TierInterface";
import PlayerDisplaySmall from "../../player/PlayerDisplaySmall";
import './Tiers.css';

interface IndividualTierProps {
    tier: Tier;
    adpType: AdpType;
    platform: Platform;
}

const IndividualTier: React.FC<IndividualTierProps> = ({ tier, adpType, platform }) => {
    const { setNodeRef, isOver, active } = useDroppable({
        id: `tier-${tier.tierNumber}`,
        data: {
            tierNumber: tier.tierNumber
        }
    });

    const isEmpty = tier.players.length === 0;
    const dropClass = isOver ? (isEmpty ? 'over-empty' : 'over-non-empty') : '';

    return (
        <div className={`individual-tier ${dropClass}`} ref={setNodeRef}>
            <h3>{tier.tierName}</h3>
            {isEmpty ? (
                <div className="empty-tier-placeholder">Drag players to add</div>
            ) : (
                <ul>
                    {tier.players.map(player => (
                        <li key={player.id}>
                            <PlayerDisplaySmall
                                player={player}
                                adpType={adpType}
                                platform={platform}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default IndividualTier;

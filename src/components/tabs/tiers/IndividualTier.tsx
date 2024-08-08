import { AdpType } from "../../../enums/AdpType.enum";
import { Platform } from "../../../enums/Platform.enum";
import { Player } from "../../../interfaces/Player";
import { Tier } from "../../../interfaces/TierInterface";
import PlayerDisplaySmall from "../../player/PlayerDisplaySmall";
import './Tiers.css';

interface IndividualTierProps {
    tier: Tier;
    adpType: AdpType;
    platform: Platform;
}

const IndividualTier: React.FC<IndividualTierProps> = ({ tier, adpType, platform }) => {
    return (
      <div className="individual-tier">
        <h3>{tier.tierName}</h3>
        {tier.players.length === 0 ? (
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
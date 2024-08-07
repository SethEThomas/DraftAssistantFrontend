import { AdpType } from "../../../enums/AdpType.enum";
import { Platform } from "../../../enums/Platform.enum";
import { Player } from "../../../interfaces/Player";
import PlayerDisplaySmall from "../../player/PlayerDisplaySmall";
import './Tiers.css';

interface IndividualTierProps {
    tier: string;
    players: Player[];
    adpType: AdpType;
    platform: Platform;
}

const IndividualTier: React.FC<IndividualTierProps> = ({ tier, players, adpType, platform }) => {
    return (
        <div className="individual-tier">
            <h3>{tier}</h3>
            <ul>
                {players.map(player => (
                    <li key={player.id}>
                        <PlayerDisplaySmall 
                            player={player} 
                            adpType={adpType} 
                            platform={platform} 
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IndividualTier;
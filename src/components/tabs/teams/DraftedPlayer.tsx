import { Player } from "../../../interfaces/Player";
import { formatNumber } from "../../../util/FormatUtil";
import "./Teams.css";

interface DraftedPlayerProps {
    player?: Player;
    position: string;
  }
  
  const DraftedPlayer: React.FC<DraftedPlayerProps> = ({ player, position }) => {
    return (
      <div className="drafted-player">
        {player ? (
          <p>{position} - {player.firstName} {player.lastName} ({formatNumber(player.stats.totalProjectedPoints)})</p>
        ) : (
          <p>{position} - Empty</p>
        )}
      </div>
    );
  };
  
  export default DraftedPlayer;
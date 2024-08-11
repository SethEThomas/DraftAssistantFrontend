import { Player } from "../../../interfaces/Player";
import "./Teams.css";

interface DraftedPlayerProps {
    player?: Player;
    position: string;
  }
  
  const DraftedPlayer: React.FC<DraftedPlayerProps> = ({ player, position }) => {
    return (
      <div className="drafted-player">
        {player ? (
          <p>{position} - {player.firstName} {player.lastName} ({player.totalProjectedPoints})</p>
        ) : (
          <p>{position} - Empty</p>
        )}
      </div>
    );
  };
  
  export default DraftedPlayer;
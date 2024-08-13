import { Position } from "../../../enums/Position.enum";
import { Player } from "../../../interfaces/Player";
import { TeamInterface } from "../../../interfaces/TeamInterface";
import { formatPickNumber } from "../../../util/PickCalculator";
import './DraftBoardPick.css';

interface DraftBoardPickProps {
    players: Player[];
    teams: TeamInterface[];
    pickNumber: number;
    selectedPlayer?: Player | null;
  }
  
  const DraftBoardPick: React.FC<DraftBoardPickProps> = ({ players, pickNumber, teams, selectedPlayer = null }) => {
    const getBackgroundColor = (position: Position) => {
      switch (position) {
        case Position.QB:
          return 'red';
        case Position.RB:
          return 'green';
        case Position.WR:
          return 'blue';
        case Position.TE:
          return 'purple';
        default:
          return '#3b3b3b';
      }
    };
  
    const player = selectedPlayer || players.find(p => p.formattedPickNumber === pickNumber.toString());
    const backgroundColor = player ? getBackgroundColor(player.position) : '#3b3b3b';
  
    return (
      <div className="draft-board-pick" style={{ backgroundColor }}>
        <div className="pick-number">
          {formatPickNumber(pickNumber, teams.length)}
        </div>
        {player && (
          <div className="player-info">
            {player.firstName} {player.lastName}
          </div>
        )}
      </div>
    );
  };
  
  export default DraftBoardPick;
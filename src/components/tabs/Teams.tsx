import { DraftSettingsInterface } from "../../interfaces/DraftSettingsInterface";
import { TeamInterface } from "../../interfaces/TeamInterface";
import IndividualTeam from "./teams/IndividualTeam";
import "./teams/Teams.css";

interface TeamsProps {
  teams: TeamInterface[];
  draftSettings: DraftSettingsInterface;
}

const Teams: React.FC<TeamsProps> = ({ teams, draftSettings }) => {
  return (
    <div className="teams-container">
      {teams.map(team => (
        <IndividualTeam key={team.teamId} team={team} draftSettings={draftSettings} />
      ))}
    </div>
  );
};

export default Teams;
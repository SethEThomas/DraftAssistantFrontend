import { Position } from "../../../enums/Position.enum";
import { DraftSettingsInterface } from "../../../interfaces/DraftSettingsInterface";
import { Player } from "../../../interfaces/Player";
import { TeamInterface } from "../../../interfaces/TeamInterface";
import DraftedPlayer from "./DraftedPlayer";
import "./Teams.css";

interface IndividualTeamProps {
  team: TeamInterface;
  draftSettings: DraftSettingsInterface;
}

const IndividualTeam: React.FC<IndividualTeamProps> = ({ team, draftSettings }) => {
  const { qbSlots, wrSlots, rbSlots, teSlots, flexSlots, benchSlots } = draftSettings.teamSettings;
  const positions = {
    [Position.QB]: qbSlots,
    [Position.WR]: wrSlots,
    [Position.RB]: rbSlots,
    [Position.TE]: teSlots,
    [Position.FLEX]: flexSlots,
  };

  const sortedPlayers = [...team.players].sort((a, b) => (b.totalProjectedPoints || 0) - (a.totalProjectedPoints || 0));

  const getPlayerComponents = (position: Position, count: number) => {
    const playersForPosition = sortedPlayers.filter(player => player.position === position);
    const emptySlots = count - playersForPosition.length;
    
    const playerComponents = playersForPosition.map(player => (
      <DraftedPlayer key={player.id} player={player} position={position} />
    ));

    const emptySlotComponents = Array.from({ length: emptySlots }).map((_, index) => (
      <DraftedPlayer key={`${position}-empty-${index}`} position={position} />
    ));

    return [...playerComponents, ...emptySlotComponents];
  };

  const getFlexAndBenchPlayers = () => {
    const flexOptions = draftSettings.teamSettings.flexOptions.map(opt => opt.toString());
    const flexPlayers = sortedPlayers.filter(player => flexOptions.includes(player.position));
    const benchPlayers = sortedPlayers.filter(player => !Object.keys(positions).includes(player.position));

    const flexSlotsAvailable = flexSlots - flexPlayers.length;
    const benchSlotsAvailable = benchSlots - benchPlayers.length;

    return {
      flexPlayers: flexPlayers.slice(0, flexSlotsAvailable),
      benchPlayers: benchPlayers.slice(0, benchSlotsAvailable),
      emptyFlexSlots: Array.from({ length: flexSlotsAvailable }).map((_, index) => (
        <DraftedPlayer key={`flex-empty-${index}`} position={Position.FLEX} />
      )),
      emptyBenchSlots: Array.from({ length: benchSlotsAvailable }).map((_, index) => (
        <DraftedPlayer key={`bench-empty-${index}`} position={Position.BENCH} />
      )),
    };
  };

  const flexAndBench = getFlexAndBenchPlayers();

  const totalProjectedPoints = (players: Player[]) =>
    players.filter(player => player.position !== Position.BENCH)
           .reduce((acc, player) => acc + (player.totalProjectedPoints || 0), 0);

  const calculateNeeds = () => {
    const needs = [];

    const qbNeeds = qbSlots - sortedPlayers.filter(player => player.position === Position.QB).length;
    const wrNeeds = wrSlots - sortedPlayers.filter(player => player.position === Position.WR).length;
    const rbNeeds = rbSlots - sortedPlayers.filter(player => player.position === Position.RB).length;
    const teNeeds = teSlots - sortedPlayers.filter(player => player.position === Position.TE).length;
    const flexNeeds = flexSlots - flexAndBench.flexPlayers.length;

    if (qbNeeds > 0) needs.push(`${qbNeeds}QB`);
    if (wrNeeds > 0) needs.push(`${wrNeeds}WR`);
    if (rbNeeds > 0) needs.push(`${rbNeeds}RB`);
    if (teNeeds > 0) needs.push(`${teNeeds}TE`);
    if (flexNeeds > 0) needs.push(`${flexNeeds}FLEX`);

    return needs.length > 0 ? `NEEDS: ${needs.join(", ")}` : "FULL";
  };

  return (
    <div className="individual-team">
      <h2>Team {team.teamId}</h2>
      <p className="team-needs">{calculateNeeds()}</p>
      <div className="players-grid">
        {getPlayerComponents(Position.QB, qbSlots)}
        {getPlayerComponents(Position.WR, wrSlots)}
        {getPlayerComponents(Position.RB, rbSlots)}
        {getPlayerComponents(Position.TE, teSlots)}
        {flexAndBench.flexPlayers.map(player => (
          <DraftedPlayer key={player.id} player={player} position={Position.FLEX} />
        ))}
        {flexAndBench.emptyFlexSlots}
        {flexAndBench.benchPlayers.map(player => (
          <DraftedPlayer key={player.id} player={player} position={Position.BENCH} />
        ))}
        {flexAndBench.emptyBenchSlots}
      </div>
      <div className="team-needs">
        <p>Season projection: {totalProjectedPoints(team.players)}</p>
      </div>
    </div>
  );
};

export default IndividualTeam;

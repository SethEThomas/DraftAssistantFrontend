import React from "react";
import { Position } from "../../../enums/Position.enum";
import { DraftSettingsInterface } from "../../../interfaces/DraftSettingsInterface";
import { Player } from "../../../interfaces/Player";
import { TeamInterface } from "../../../interfaces/TeamInterface";
import { formatNumber } from "../../../util/FormatUtil";
import DraftedPlayer from "./DraftedPlayer";
import "./Teams.css";

interface IndividualTeamProps {
  team: TeamInterface;
  draftSettings: DraftSettingsInterface;
}

const IndividualTeam: React.FC<IndividualTeamProps> = ({ team, draftSettings }) => {
  const { qbSlots, wrSlots, rbSlots, teSlots, flexSlots, benchSlots, flexOptions } = draftSettings.teamSettings;

  const positionSlots: Record<Position, number> = {
    [Position.QB]: qbSlots,
    [Position.WR]: wrSlots,
    [Position.RB]: rbSlots,
    [Position.TE]: teSlots,
    [Position.FLEX]: flexSlots,
    [Position.OVERALL]: 0,
    [Position.UNKNOWN]: 0,
    [Position.BENCH]: benchSlots,
  };

  const sortedPlayers = [...team.players].sort((a, b) => {
    return (b.stats.totalProjectedPoints ?? 0) - (a.stats.totalProjectedPoints ?? 0);
  });

  const assignedPlayers: Partial<Record<Position, Player[]>> = {
    [Position.QB]: [],
    [Position.WR]: [],
    [Position.RB]: [],
    [Position.TE]: [],
    [Position.FLEX]: [],
    [Position.BENCH]: [],
  };

  const recalculateAssignments = () => {
    for (const player of sortedPlayers) {
      assignPlayerToSlot(player, player.position);
    }
    const remainingPlayers = sortedPlayers.filter(
      (player) => !Object.values(assignedPlayers).flat().includes(player)
    );
    for (const player of remainingPlayers) {
      if (flexOptions.includes(player.position)) {
        assignPlayerToSlot(player, Position.FLEX);
      }
    }
    const remainingForBench = sortedPlayers.filter(
      (player) => !Object.values(assignedPlayers).flat().includes(player)
    );
    for (const player of remainingForBench) {
      assignPlayerToSlot(player, Position.BENCH);
    }
  };

  const assignPlayerToSlot = (player: Player, slot: Position) => {
    if (slot !== Position.OVERALL && slot !== Position.UNKNOWN) {
      if (assignedPlayers[slot]?.length! < positionSlots[slot]) {
        assignedPlayers[slot]?.push(player);
        return true;
      } else {
        const minProjectedPlayer = assignedPlayers[slot]?.reduce((min, p) =>
          p.stats.totalProjectedPoints! < min.stats.totalProjectedPoints! ? p : min
        );
        if (minProjectedPlayer && player.stats.totalProjectedPoints! > minProjectedPlayer.stats.totalProjectedPoints!) {
          assignedPlayers[slot] = assignedPlayers[slot]?.filter((p) => p !== minProjectedPlayer);
          assignedPlayers[slot]?.push(player);
          if (!assignPlayerToSlot(minProjectedPlayer, Position.FLEX)) {
            assignPlayerToSlot(minProjectedPlayer, Position.BENCH);
          }
          return true;
        }
      }
    }
    return false;
  };

  recalculateAssignments();

  const getPlayerComponents = (position: Position, count: number) => {
    if (position === Position.OVERALL || position === Position.UNKNOWN) {
      return null;
    }

    const playersForPosition = assignedPlayers[position] || [];
    const emptySlots = count - playersForPosition.length;

    const playerComponents = playersForPosition.map((player) => (
      <DraftedPlayer key={player.id} player={player} position={position} />
    ));

    const emptySlotComponents = Array.from({ length: emptySlots }).map((_, index) => (
      <DraftedPlayer key={`${position}-empty-${index}`} position={position} />
    ));

    return [...playerComponents, ...emptySlotComponents];
  };

  const calculateNeeds = () => {
    const needs = [];

    const qbNeeds = qbSlots - (assignedPlayers[Position.QB]?.length || 0);
    const wrNeeds = wrSlots - (assignedPlayers[Position.WR]?.length || 0);
    const rbNeeds = rbSlots - (assignedPlayers[Position.RB]?.length || 0);
    const teNeeds = teSlots - (assignedPlayers[Position.TE]?.length || 0);
    const flexNeeds = flexSlots - (assignedPlayers[Position.FLEX]?.length || 0);

    if (qbNeeds > 0) needs.push(`${qbNeeds} QB`);
    if (wrNeeds > 0) needs.push(`${wrNeeds} WR`);
    if (rbNeeds > 0) needs.push(`${rbNeeds} RB`);
    if (teNeeds > 0) needs.push(`${teNeeds} TE`);
    if (flexNeeds > 0) needs.push(`${flexNeeds} FLEX`);

    return needs.length > 0 ? `NEEDS: ${needs.join(", ")}` : "FULL";
  };

  const totalProjectedPoints = (assignedPlayers: Partial<Record<Position, Player[]>>) =>
    Object.keys(assignedPlayers).reduce((acc, position) => {
      if (position !== Position.BENCH) {
        acc += (assignedPlayers[position as Position]?.reduce((sum, player) => sum + (player.stats.totalProjectedPoints ?? 0), 0)) || 0;
      }
      return acc;
    }, 0);

  const borderClass = team.teamId === draftSettings.myTeam ? "gold-border" : "";

  return (
    <div className={`individual-team ${borderClass}`}>
      <h2>Team {team.teamId}</h2>
      <p className="team-needs">{calculateNeeds()}</p>
      <div className="players-grid">
        {getPlayerComponents(Position.QB, qbSlots)}
        {getPlayerComponents(Position.WR, wrSlots)}
        {getPlayerComponents(Position.RB, rbSlots)}
        {getPlayerComponents(Position.TE, teSlots)}
        {getPlayerComponents(Position.FLEX, flexSlots)}
        {getPlayerComponents(Position.BENCH, benchSlots)}
      </div>
      <div className="team-needs">
        <p>Season projection: {formatNumber(totalProjectedPoints(assignedPlayers))}</p>
      </div>
    </div>
  );
};

export default IndividualTeam;

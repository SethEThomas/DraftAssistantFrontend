import React from "react";
import { DraftSettingsInterface } from "../../interfaces/DraftSettingsInterface";
import { Player } from "../../interfaces/Player";
import { TeamInterface } from "../../interfaces/TeamInterface";
import DraftBoardPick from "./draftboard/DraftBoardPick";
import './DraftBoard.css';

interface DraftBoardProps {
    draftSettings: DraftSettingsInterface;
    players: Player[];
    teams: TeamInterface[];
    draftPickSelections: Map<number, Player>;
    hideDrafted: boolean;
    setTeams: React.Dispatch<React.SetStateAction<TeamInterface[]>>;
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    setDraftPickSelections: React.Dispatch<React.SetStateAction<Map<number, Player>>>;
}

const DraftBoard: React.FC<DraftBoardProps> = ({ draftSettings, players, teams, draftPickSelections, hideDrafted, setTeams, setPlayers, setDraftPickSelections }) => {
    const generatePickNumber = (round: number, teamId: number, numTeams: number) => {
        let pickNumber: number;

        if (draftSettings.thirdRoundReversal) {
            if (round === 1) {
                pickNumber = (round - 1) * numTeams + teamId;
            } else if (round === 2) {
                pickNumber = round * numTeams - teamId + 1;
            } else if (round === 3) {
                pickNumber = round * numTeams - teamId + 1;
            } else if (round % 2 === 0) {
                pickNumber = (round - 1) * numTeams + teamId;
            } else {
                pickNumber = round * numTeams - teamId + 1;
            }
        } else {
            if (round % 2 === 1) {
                pickNumber = (round - 1) * numTeams + teamId;
            } else {
                pickNumber = round * numTeams - teamId + 1;
            }
        }

        return pickNumber;
    };

    return (
        <div className="draft-board">
            <div className="draft-board-grid">
                <div className="draft-board-header">
                    {teams.map(team => (
                        <div key={team.teamId} className="draft-board-header-cell">
                            Team {team.teamId}
                        </div>
                    ))}
                </div>
                {[...Array(draftSettings.numRounds)].map((_, roundIndex) => (
                    <div key={roundIndex} className="draft-board-row">
                        {[...Array(teams.length)].map((_, teamIndex) => {
                            const teamId = teamIndex + 1;
                            const pickNumber = generatePickNumber(roundIndex + 1, teamId, teams.length);
                            return (
                                <DraftBoardPick
                                    key={teamIndex}
                                    players={players}
                                    teams={teams}
                                    pickNumber={pickNumber}
                                    teamId={teamId}
                                    draftPickSelections={draftPickSelections}
                                    hideDrafted={hideDrafted}
                                    setTeams={setTeams}
                                    setPlayers={setPlayers}
                                    setDraftPickSelections={setDraftPickSelections}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DraftBoard;

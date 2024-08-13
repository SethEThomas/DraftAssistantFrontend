import React, { useState, useRef, useEffect } from "react";
import { Position } from "../../../enums/Position.enum";
import { Player } from "../../../interfaces/Player";
import { TeamInterface } from "../../../interfaces/TeamInterface";
import { formatPickNumber } from "../../../util/PickCalculator";
import './DraftBoardPick.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface DraftBoardPickProps {
    players: Player[];
    teams: TeamInterface[];
    pickNumber: number;
    teamId: number;
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    setTeams: React.Dispatch<React.SetStateAction<TeamInterface[]>>;
}

const DraftBoardPick: React.FC<DraftBoardPickProps> = ({ players, pickNumber, teams, teamId, setPlayers, setTeams }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getBackgroundColor = (position: Position) => {
        switch (position) {
            case Position.QB:
                return 'darkred';
            case Position.RB:
                return 'darkgreen';
            case Position.WR:
                return 'darkblue';
            case Position.TE:
                return 'darkorange';
            default:
                return '#3b3b3b';
        }
    };

    const player = selectedPlayer || players.find(p => p.formattedPickNumber === pickNumber.toString());
    const backgroundColor = player ? getBackgroundColor(player.position) : '#3b3b3b';

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchText(text);

        if (text.trim() === '') {
            setFilteredPlayers([]);
        } else {
            setFilteredPlayers(players.filter(p => p.normalizedName.toLowerCase().includes(text.toLowerCase())));
        }
    };

    const handlePlayerSelect = (player: Player) => {
        setSelectedPlayer(player);

        const updatedTeams = teams.map(team => {
            if (team.teamId === teamId) {
                return {
                    ...team,
                    players: [...team.players, player],
                };
            }
            return team;
        });

        setTeams(updatedTeams);

        const updatedPlayers = players.map(p => p.id === player.id ? { ...p, isDrafted: true } : p);
        setPlayers(updatedPlayers);
        setShowDropdown(false);
    };

    const handleRemovePlayer = () => {
        if (selectedPlayer) {
            const updatedTeams = teams.map(team => {
                if (team.teamId === teamId) {
                    return {
                        ...team,
                        players: team.players.filter(p => p.id !== selectedPlayer.id),
                    };
                }
                return team;
            });

            const updatedPlayers = players.map(p => p.id === selectedPlayer.id ? { ...p, isDrafted: false } : p);

            setTeams(updatedTeams);
            setPlayers(updatedPlayers);
            setSelectedPlayer(null);
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="draft-board-pick" style={{ backgroundColor }}>
            {selectedPlayer ? (
                <div className="player-info">
                    <div className="remove-icon-container" onClick={handleRemovePlayer}>
                        <FontAwesomeIcon icon={faTrashAlt} className="remove-icon" />
                    </div>
                    <div className="player-name">
                        {selectedPlayer.firstName} {selectedPlayer.lastName}
                    </div>
                    <div className="player-details">
                        {selectedPlayer.position} ◆ {selectedPlayer.teamAbbreviation}
                    </div>
                </div>
            ) : (
                <div className="add-player-container">
                    <div className="add-icon-container" onClick={() => setShowDropdown(!showDropdown)}>
                        <div className="add-icon">
                            +
                        </div>
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu" ref={dropdownRef}>
                            <input
                                type="text"
                                value={searchText}
                                onChange={handleSearchChange}
                                placeholder="Enter player name to search"
                            />
                            {filteredPlayers.length === 0 && searchText ? (
                                <div>No players found</div>
                            ) : (
                                filteredPlayers.map(player => (
                                    <div
                                        key={player.id}
                                        className="dropdown-item"
                                        onClick={() => handlePlayerSelect(player)}
                                    >
                                        {player.firstName} {player.lastName} | {player.position} ◆ {player.teamAbbreviation}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
            <div className="pick-number">
                {formatPickNumber(pickNumber, teams.length)}
            </div>
        </div>
    );
};

export default DraftBoardPick;

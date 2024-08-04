import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PlayerDropdown.css';

interface Player {
    id: number;
    firstName: string;
    lastName: string;
    teamAbbreviation: string;
    position: string;
    normalizedName: string;
}

interface PlayerDropdownProps {
    players: Player[];
}

const positionColors: { [key: string]: string } = {
    QB: 'darkred',
    WR: 'darkblue',
    TE: 'darkorange',
    RB: 'darkgreen',
};

const PlayerDropdown: React.FC<PlayerDropdownProps> = ({ players }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const filtered = players.filter(player => {
            const normalizedName = player.normalizedName.replace(/\s+/g, '').toLowerCase();
            const searchNormalized = searchQuery.replace(/\s+/g, '').toLowerCase();
            return normalizedName.includes(searchNormalized);
        });
        setFilteredPlayers(filtered);
    }, [searchQuery, players]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setDropdownVisible(true);
    };

    const handleDropdownClick = () => {
        setDropdownVisible(false);
    };

    return (
        <div className="dropdown-container">
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search for a player"
                />
            </div>
            {dropdownVisible && filteredPlayers.length > 0 && (
                <div className="dropdown-menu">
                    {filteredPlayers.map(player => {
                        const positionColor = positionColors[player.position] || '#ffffff'; // Default color
                        return (
                            <Link
                                key={player.id}
                                to={`http://localhost:8081/players/${player.id}`}
                                className="dropdown-item"
                                onClick={handleDropdownClick}
                                style={{ backgroundColor: positionColor }}
                            >
                                <div className="dropdown-item-content">
                                    <div className="player-info">
                                        <span className="player-name">{player.firstName} {player.lastName}</span>
                                        <span className="player-team-position">({player.teamAbbreviation}, {player.position})</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PlayerDropdown;

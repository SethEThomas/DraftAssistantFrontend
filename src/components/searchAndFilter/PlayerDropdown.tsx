import React, { useState, useEffect } from 'react';
import './PlayerDropdown.css';
import EditPlayerModal from '../player/EditPlayerModal';
import { Player } from '../../interfaces/Player';

interface PlayerDropdownProps {
    players: Player[];
    onUpdatePlayer: (updatedPlayer: Player) => void;
}

const positionColors: { [key: string]: string } = {
    QB: 'darkred',
    WR: 'darkblue',
    TE: 'darkorange',
    RB: 'darkgreen',
};

const PlayerDropdown: React.FC<PlayerDropdownProps> = ({ players, onUpdatePlayer }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const filtered = players.filter(player => {
            const normalizedName = player.normalizedName.replace(/\s+/g, '').toLowerCase();
            const searchNormalized = searchQuery.replace(/\s+/g, '').toLowerCase();
            return normalizedName.includes(searchNormalized);
        });
        setFilteredPlayers(filtered);
    }, [searchQuery, players]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setDropdownVisible(query.length > 0);
    };

    const handleBlur = () => {
        // Timeout to ensure dropdown click event is processed before hiding
        setTimeout(() => {
            setSearchQuery('');
            setDropdownVisible(false);
        }, 100);
    };

    const handleDropdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); // Prevent the dropdown from closing when clicking inside it
    };

    const handleEditPlayer = (player: Player) => {
        setSelectedPlayer(player);
    };

    const handleCloseModal = () => {
        setSelectedPlayer(null);
    };

    const handleSubmitModal = (updatedPlayer: Player) => {
        onUpdatePlayer(updatedPlayer); // Update player in parent state
        setSelectedPlayer(null);
    };

    return (
        <div className="dropdown-container">
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Search for a player"
                />
            </div>
            {dropdownVisible && filteredPlayers.length > 0 && (
                <div className="dropdown-menu" onClick={handleDropdownClick}>
                    {filteredPlayers.map(player => {
                        const positionColor = positionColors[player.position] || '#ffffff'; // Default color
                        return (
                            <div
                                key={player.id}
                                className="dropdown-item"
                                onClick={() => handleEditPlayer(player)}
                                style={{ backgroundColor: positionColor }}
                            >
                                <div className="dropdown-item-content">
                                    <div className="player-info">
                                        <span className="player-name">{player.firstName} {player.lastName}</span>
                                        <span className="player-team-position">({player.teamAbbreviation}, {player.position})</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {selectedPlayer && (
                <EditPlayerModal
                    player={selectedPlayer}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitModal}
                />
            )}
        </div>
    );
};

export default PlayerDropdown;
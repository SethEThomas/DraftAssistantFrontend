import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import nerd from '../../assets/images/nerd.jpeg';
import { Player } from '../../interfaces/Player';
import PlayerDropdown from '../searchAndFilter/PlayerDropdown';
import axios from 'axios';
import { BACKEND_URL } from '../../util/constants';

interface MainNavbarProps {
    players: Player[];
    onUpdatePlayer: (updatedPlayer: Player) => void;
    setPlayers: (players: Player[]) => void;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ players, onUpdatePlayer, setPlayers }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleRefreshStats = async () => {
        try {
            await axios.post(`${BACKEND_URL}/load-player-data?sources=ALL`);
            console.log('Stats/ADPs refreshed successfully');
        } catch (error) {
            console.error('Error refreshing Stats/ADPs:', error);
        }
    };

    const handleFixRanks = () => {
        const fixedPlayers = [...players];
        const playersWithValidOverallRank = fixedPlayers.filter(player => player.overallRank !== 0);
        playersWithValidOverallRank.sort((a, b) => a.overallRank - b.overallRank);
        playersWithValidOverallRank.forEach((player, index) => {
            player.overallRank = index + 1;
        });
        const positions = Array.from(new Set(fixedPlayers.map(player => player.position)));
        positions.forEach(position => {
            const positionPlayers = fixedPlayers.filter(player => player.position === position && player.positionalRank !== 0);
            positionPlayers.sort((a, b) => a.positionalRank - b.positionalRank);
            positionPlayers.forEach((player, index) => {
                player.positionalRank = index + 1;
            });
        });
        setPlayers(fixedPlayers);
    };
    
    

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={nerd} alt="Logo" className="logo" />
                <h2 className="navbar-left-text">Draft Assistant</h2>
            </div>
            <div className="navbar-center">
                <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                    Draft Board
                </NavLink>
                <NavLink to="/draft-settings" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Draft Settings
                </NavLink>
                <NavLink to="/teams" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Teams
                </NavLink>
                <NavLink to="/tiers" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Tiers
                </NavLink>
            </div>
            <div className="navbar-right">
                <PlayerDropdown players={players} onUpdatePlayer={onUpdatePlayer} />
                <div className="wrench-container">
                    <i
                        className="fas fa-wrench"
                        onClick={() => setShowDropdown(!showDropdown)}
                    ></i>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <button onClick={handleRefreshStats}>Refresh Stats/ADPs</button>
                            <button onClick={handleFixRanks}>Fix Ranks</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default MainNavbar;

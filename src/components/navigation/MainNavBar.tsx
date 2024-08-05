import React from 'react';
import { NavLink } from 'react-router-dom';
import nerd from '../../assets/images/nerd.jpeg';
import { Player } from '../../interfaces/Player';
import PlayerDropdown from '../searchAndFilter/PlayerDropdown';

interface MainNavbarProps {
    players: Player[];
    onUpdatePlayer: (updatedPlayer: Player) => void;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ players, onUpdatePlayer }) => {
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
            </div>
        </nav>
    );
};

export default MainNavbar;
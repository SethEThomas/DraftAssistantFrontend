import React from 'react';
import { NavLink } from 'react-router-dom';
import nerd from '../../assets/images/nerd.jpeg';

const MainNavbar: React.FC = () => {
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
            <h2>Player search</h2>
        </div>
    </nav>
  );
}

export default MainNavbar;

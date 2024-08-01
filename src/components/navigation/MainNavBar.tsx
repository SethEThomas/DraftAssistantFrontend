import React from 'react';
import { Link } from 'react-router-dom';

const MainNavbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/">Draft Board</Link>
      <Link to="/draft-settings">Draft Settings</Link>
      <Link to="/teams">Teams</Link>
      <Link to="/tiers">Tiers</Link>
    </nav>
  );
}

export default MainNavbar;
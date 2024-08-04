import React from 'react';
import { Player } from '../../interfaces/Player';

interface DraftBoardProps {
    players: Player[];
  }

const DraftBoard: React.FC<DraftBoardProps> = ({ players }) => {
  return (
    <div>
      <h2>Draftboard</h2>
      <ul>
      {players.map(player => (
        <li key={player.id}>{player.firstName}</li>
      ))}
    </ul>
    </div>
  );
}

export default DraftBoard;
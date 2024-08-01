import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Player {
  id: number;
  firstName: string;
}

function App() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    axios.get<Player[]>('http://localhost:8080/api/players')
      .then(response => {
        setPlayers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <ul>
      {players.map(player => (
        <li key={player.id}>{player.firstName}</li>
      ))}
    </ul>
  );
}

export default App;

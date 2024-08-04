import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DraftBoard from './components/tabs/DraftBoard';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import DraftSettings from './components/tabs/DraftSettings';
import Teams from './components/tabs/Teams';
import Tiers from './components/tabs/Tiers';
import MainNavbar from './components/navigation/MainNavBar';
import MainSidebar from './components/sidebar/MainSidebar';
import './App.css';
import { Player } from './interfaces/Player';


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
    <BrowserRouter>
      <div className="app">
        <MainNavbar />
        <div className="main-layout">
          <MainSidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DraftBoard players={players} />} />
              <Route path="/draft-settings" element={<DraftSettings />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/tiers" element={<Tiers />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

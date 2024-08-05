import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DraftBoard from './components/tabs/DraftBoard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DraftSettings from './components/tabs/DraftSettings';
import Teams from './components/tabs/Teams';
import Tiers from './components/tabs/Tiers';
import MainNavbar from './components/navigation/MainNavBar';
import MainSidebar from './components/sidebar/MainSidebar';
import './App.css';
import { Player } from './interfaces/Player';
import { BACKEND_URL } from './util/constants';
import { AdpType } from './enums/AdpType.enum';
import { Platform } from './enums/Platform.enum';
import { DraftSettingsInterface } from './interfaces/DraftSettingsInterface';
import { ScoringSettings } from './interfaces/ScoringSettings';
import { Position } from './enums/Position.enum';

const initialDraftSettings: DraftSettingsInterface = {
  numTeams: 10,
  myTeam: 1,
  numRounds: 15,
  thirdRoundReversal: false,
  displayAdpType: AdpType.STANDARD,
  displayAdpPlatform: Platform.SLEEPER,
  scoringSettings: {
      completionPctPoints: 0,
      passing2PtPoints: 2,
      passAttemptPoints: 0,
      passCompletionPoints: 0,
      passingFirstDownPoints: 0,
      passingInterceptionPoints: -2,
      passingTdPoints: 6,
      passingYardPoints: 0.04,
      fumblePoints: -2,
      receiving2PtPoints: 2,
      receptionPoints: 1,
      reception40PlusPoints: 1,
      receptionFirstDownPoints: 0,
      receivingTdPoints: 6,
      receivingYardPoints: 0.1,
      rushing2PtPoints: 2,
      rushingAttemptPoints: 0,
      rushingFirstDownPoints: 0,
      rushingTdPoints: 6,
      rushingYardPoints: 0.1,
      teReceptionBonusPoints: 0.5,
  },
  teamSettings: {
      qbSlots: 1,
      wrSlots: 2,
      rbSlots: 2,
      teSlots: 1,
      flexSpots: 2,
      flexOptions: [Position.WR, Position.RB, Position.TE],
      benchSlots: 7,
  },
};

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftSettings, setDraftSettings] = useState<DraftSettingsInterface>(initialDraftSettings);

  useEffect(() => {
      axios.get<Player[]>(BACKEND_URL + '/players')
          .then(response => {
              setPlayers(response.data);
              setLoading(false);
          })
          .catch(error => {
              console.error(error);
              setLoading(false);
          });

      axios.get<ScoringSettings>(BACKEND_URL + '/scoring-settings')
          .then(response => {
              setDraftSettings(prevSettings => ({
                  ...prevSettings,
                  scoringSettings: response.data,
              }));
          })
          .catch(error => {
              console.error(error);
          });
  }, []);

  const handleUpdatePlayer = (updatedPlayer: Player) => {
      setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
              player.id === updatedPlayer.id ? updatedPlayer : player
          )
      );
  };

  const handleUpdateDraftSettings = (updatedSettings: DraftSettingsInterface) => {
      setDraftSettings(updatedSettings);
  };

  return (
      <BrowserRouter>
          <div className="app">
              <MainNavbar players={players} onUpdatePlayer={handleUpdatePlayer} />
              <div className="main-layout">
                  <MainSidebar players={players} loading={loading} />
                  <main className="main-content">
                      <Routes>
                          <Route path="/" element={<DraftBoard players={players} />} />
                          <Route path="/draft-settings" element={<DraftSettings draftSettings={draftSettings} onSave={handleUpdateDraftSettings} />} />
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
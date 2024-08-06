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
import { Position } from './enums/Position.enum';
import { ScoringSettingInterface } from './interfaces/ScoringSettingInterface';

const initialDraftSettings: DraftSettingsInterface = {
    numTeams: 10,
    myTeam: 1,
    numRounds: 15,
    thirdRoundReversal: false,
    displayAdpType: AdpType.STANDARD,
    displayAdpPlatform: Platform.SLEEPER,
    scoringSettings: [],
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
    const [updating, setUpdating] = useState(false);
  
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
  
      axios.get<ScoringSettingInterface[]>(BACKEND_URL + '/scoring/settings')
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
        const settingsChanged = JSON.stringify(draftSettings.scoringSettings) !== JSON.stringify(updatedSettings.scoringSettings);
      
        if (settingsChanged) {
          setUpdating(true);
      
          // Transform the scoring settings to the required format
          const scoringSettingsPayload = updatedSettings.scoringSettings.map(setting => ({
            scoringSettingId: setting.id,
            pointValue: setting.pointValue,
          }));
      
          axios.post<Player[]>(BACKEND_URL + '/scoring/update?returnPlayers=true', scoringSettingsPayload)
            .then(response => {
              setPlayers(response.data);
              setUpdating(false);
            })
            .catch(error => {
              console.error(error);
              setUpdating(false);
            });
        }
      
        setDraftSettings(updatedSettings);
      };
      
  
    if (loading || updating) {
      return (
        <div className="loading-container">
          <div className="dots-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      );
    }
  
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
import React, { useState } from 'react';
import { Player } from '../../interfaces/Player';
import { DraftSettingsInterface } from '../../interfaces/DraftSettingsInterface';
import { TeamInterface } from '../../interfaces/TeamInterface';
import './MainSidebar.css';
import PlayerSearchTab from './PlayerSearchTab';
import PredictionsTab from './PredictionsTab';
import SuggestionsTab from './SuggestionsTab';
import { usePredictions } from './PredictionsContext';

interface SidebarProps {
    players: Player[];
    loading: boolean;
    draftSettings: DraftSettingsInterface;
    teams: TeamInterface[];
    hideDrafted: boolean;
    onFavoriteToggle: (playerId: number) => void;
}

const MainSidebar: React.FC<SidebarProps> = (props) => {
    const [selectedTab, setSelectedTab] = useState('PlayerSearch');
    const { predictions } = usePredictions(); 

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'PlayerSearch':
                return <PlayerSearchTab {...props} />;
            case 'Predictions':
                return <PredictionsTab players={props.players} teams={props.teams} draftSettings={props.draftSettings}/>;
            case 'Suggestions':
                return <SuggestionsTab players={props.players} draftSettings={props.draftSettings} onFavoriteToggle={props.onFavoriteToggle}/>;
            default:
                return null;
        }
    };

    return (
        <div className="sidebar">
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${selectedTab === 'PlayerSearch' ? 'active' : ''}`} 
                    onClick={() => setSelectedTab('PlayerSearch')}
                >
                    Player Search
                </button>
                <button 
                    className={`tab-btn ${selectedTab === 'Predictions' ? 'active' : ''}`} 
                    onClick={() => setSelectedTab('Predictions')}
                >
                    Predictions
                </button>
                <button 
                    className={`tab-btn ${selectedTab === 'Suggestions' ? 'active' : ''}`} 
                    onClick={() => setSelectedTab('Suggestions')}
                >
                    Suggestions
                </button>
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
}

export default MainSidebar;

import React, { useState } from 'react';
import { Player } from '../../interfaces/Player';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import PlayerDisplaySmall from '../player/PlayerDisplaySmall';
import './MainSidebar.css';
import PositionFilter from '../searchAndFilter/PositionFilter';
import SearchInput from '../searchAndFilter/SearchInput';

interface SidebarProps {
    players: Player[];
    loading: boolean;
    adpType: AdpType;
    platform: Platform;
    onFavoriteToggle: (playerId: number) => void;
}

const MainSidebar: React.FC<SidebarProps> = ({ players, loading, adpType, platform, onFavoriteToggle }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('All');
    const [isCollapsed, setIsCollapsed] = useState(false); // State for collapse

    const filteredPlayers = players.filter(player => {
        const normalizedName = player.normalizedName.replace(/\s+/g, '').toLowerCase();
        const searchNormalized = searchQuery.replace(/\s+/g, '').toLowerCase();
        const matchesSearch = normalizedName.includes(searchNormalized);
        const matchesPosition = selectedPosition === 'All' || player.position === selectedPosition;
        return matchesSearch && matchesPosition;
    });

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? '▶' : '◀'}
            </button>
            {loading ? (
                <div className="loading-container">
                    <div className="dots-container">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
            ) : (
                <>
                    {!isCollapsed && (
                        <>
                            <SearchInput 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <PositionFilter 
                                selectedPosition={selectedPosition}
                                onPositionChange={setSelectedPosition}
                            />
                        </>
                    )}
                    <div>
                        <ul>
                            {filteredPlayers.map(player => (
                                <li key={player.id}>
                                    <PlayerDisplaySmall 
                                        player={player} 
                                        adpType={adpType}
                                        platform={platform}
                                        onFavoriteToggle={onFavoriteToggle}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}

export default MainSidebar;
import { useState } from 'react';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import { Player } from '../../interfaces/Player';
import PlayerDisplaySmall from '../player/PlayerDisplaySmall';
import PositionFilter from '../searchAndFilter/PositionFilter';
import SearchInput from '../searchAndFilter/SearchInput';
import './MainSidebar.css';

interface PlayerSearchTabProps {
    players: Player[];
    loading: boolean;
    adpType: AdpType;
    platform: Platform;
    hideDrafted: boolean;
    onFavoriteToggle: (playerId: number) => void;
}

const PlayerSearchTab: React.FC<PlayerSearchTabProps> = ({ players, loading, adpType, platform, hideDrafted, onFavoriteToggle }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('All');

    const filteredPlayers = players.filter(player => {
        const normalizedName = player.normalizedName.replace(/\s+/g, '').toLowerCase();
        const searchNormalized = searchQuery.replace(/\s+/g, '').toLowerCase();
        const matchesSearch = normalizedName.includes(searchNormalized);
        const matchesPosition = selectedPosition === 'All' || player.position === selectedPosition;
        const matchesDraftStatus = !hideDrafted || !player.isDrafted;
        return matchesSearch && matchesPosition && matchesDraftStatus;
    });

    return (
        <div>
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
                    <SearchInput 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <PositionFilter 
                        selectedPosition={selectedPosition}
                        onPositionChange={setSelectedPosition}
                    />
                    <div className={`player-list ${filteredPlayers.length === 0 ? 'empty' : ''}`}>
                        <ul>
                            {filteredPlayers.map(player => (
                                <li key={player.id}>
                                    <PlayerDisplaySmall 
                                        player={player} 
                                        adpType={adpType}
                                        platform={platform}
                                        onFavoriteToggle={onFavoriteToggle}
                                        hideDrafted={hideDrafted}
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

export default PlayerSearchTab;
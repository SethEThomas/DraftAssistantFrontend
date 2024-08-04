import React from 'react';
import { Player } from '../../interfaces/Player';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import PlayerDisplaySmall from '../player/PlayerDisplaySmall';
import '../../App.css';

interface SidebarProps {
    players: Player[];
    loading: boolean;
}

const MainSidebar: React.FC<SidebarProps> = ({ players, loading }) => {
    return (
        <div className="sidebar">
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
                    <p>Player search will go here</p>
                    <p>Position filter will go here</p>
                    <div>
                        <ul>
                            {players.map(player => (
                                <li key={player.id}>
                                    <PlayerDisplaySmall 
                                        player={player} 
                                        adpType={AdpType.HALF_PPR}
                                        platform={Platform.SLEEPER}
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
import React from 'react';
import { Player } from '../../interfaces/Player';
import { formatPlayer } from '../../util/FormatUtil';

interface DraftBoardProps {
    players: Player[];
}

const DraftBoard: React.FC<DraftBoardProps> = ({ players }) => {
    const formattedPlayers = players.map(formatPlayer);
    
    return (
        <div>
            <h2>Draftboard</h2>
        </div>
    );
}

export default DraftBoard;

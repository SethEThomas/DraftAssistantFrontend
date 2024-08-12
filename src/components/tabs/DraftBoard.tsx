import React from 'react';
import { Player } from '../../interfaces/Player';
import { calculateTeamPick, formatPickNumber } from '../../util/PickCalculator';

interface DraftBoardProps {
    players: Player[];
}

const DraftBoard: React.FC<DraftBoardProps> = ({ players }) => {
    const numbers: number[] = Array.from({ length: 180 }, (_, index) => index + 1);
    
    return (
        <div>
            <h2>Draftboard</h2>
            <ul>
                {numbers.map(number => (
                    <li key={number}>Pick Number: {number} ({formatPickNumber(number, 12)})  team: {calculateTeamPick(number, 12, true)} </li>
                ))}
            </ul>
        </div>
    );
}

export default DraftBoard;

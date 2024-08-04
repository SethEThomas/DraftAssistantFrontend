import React from 'react';
import './PositionFilter.css';

interface PositionFilterProps {
    selectedPosition: string;
    onPositionChange: (position: string) => void;
}

const positions = ["All", "QB", "WR", "RB", "TE"];

const PositionFilter: React.FC<PositionFilterProps> = ({ selectedPosition, onPositionChange }) => {
    return (
        <div className="position-filter">
            {positions.map(position => (
                <div
                    key={position}
                    className={`position-tab ${selectedPosition === position ? 'active' : ''}`}
                    onClick={() => onPositionChange(position)}
                >
                    {position}
                </div>
            ))}
        </div>
    );
}

export default PositionFilter;

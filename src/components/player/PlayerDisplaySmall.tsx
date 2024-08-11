import React, { useState } from 'react';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import { Position } from '../../enums/Position.enum';
import { Player } from '../../interfaces/Player';
import { formatNumber } from '../../util/FormatUtil';
import './PlayerDisplaySmall.css';
import { renderStarRating } from './StarRating';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PlayerDisplaySmallProps {
    player: Player;
    adpType: AdpType;
    platform: Platform;
    onFavoriteToggle: (playerId: number) => void;
}

const positionColorMapping: Partial<Record<Position, string>> = {
    [Position.QB]: 'darkred',
    [Position.WR]: 'darkblue',
    [Position.RB]: 'darkgreen',
    [Position.TE]: 'darkorange',
};

const getColorForPosition = (position: Position): string => {
    return positionColorMapping[position] || 'gray';
};

const toCamelCase = (str: string) => {
    return str
        .toLowerCase()
        .replace(/_./g, match => match[1].toUpperCase())
        .replace(/^\w/, match => match.toUpperCase())
        .replace("_","");
};

const PlayerDisplaySmall: React.FC<PlayerDisplaySmallProps> = ({ player, adpType, platform, onFavoriteToggle }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id: `player-${player.id}`});
    const [isFavorite, setIsFavorite] = useState(player.isSleeper);
    const backgroundColor = positionColorMapping[player.position];
    const adpField = `${Platform[platform].toLowerCase()}${toCamelCase(AdpType[adpType])}`;
    const adpValue = (player.adp as any)[adpField];
    const platformLabel = Platform[platform].replace(/_/g, ' ');
    const adpTypeLabel = AdpType[adpType].replace(/_/g, ' ');

    const transitionStyle = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.7 : 1,
        border: isFavorite ? '2px solid red' : 'none'
    };

    const handleFavoriteToggle = () => {
        setIsFavorite(prevState => !prevState);
        onFavoriteToggle(player.id);
    };

    return (
        <div
            className="player-display-small"
            style={{ backgroundColor, ...transitionStyle }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <div className="left-column">
                <div className="player-name">
                    {player.firstName} {player.lastName}
                    <div
                        className={`favorite-icon ${isFavorite ? 'favorited' : ''}`}
                        onClick={handleFavoriteToggle}
                    >
                        <i className={isFavorite ? 'fas fa-heart' : 'far fa-heart'}></i>
                    </div>
                </div>
                <div className="player-position">{player.position} {player.teamAbbreviation}</div>
                <div className="adp-info">
                    <div className="label">{platformLabel} {adpTypeLabel} ADP:</div>
                    <div className="value">{formatNumber(adpValue)}</div>
                </div>
            </div>
            <div className="middle-column">
                <div className="stat-section">
                    <div className="label">Overall</div>
                    <div className="stat">
                        <div className="stat-item">
                            <div className="label">Tier:</div>
                            <div className="value">{player.overallTier}</div>
                        </div>
                        <div className="stat-item">
                            <div className="label">Rank:</div>
                            <div className="value">{player.overallRank}</div>
                        </div>
                    </div>
                </div>
                <div className="horizontal-line"></div>
                <div className="stat-section">
                    <div className="label">Proj.</div>
                    <div className="value">{formatNumber(player.stats.totalProjectedPoints)}</div>
                </div>
            </div>
            <div className="right-column">
                <div className="stat-section">
                    <div className="label">Positional</div>
                    <div className="stat">
                        <div className="stat-item">
                            <div className="label">Tier:</div>
                            <div className="value">{player.positionalTier}</div>
                        </div>
                        <div className="stat-item">
                            <div className="label">Rank:</div>
                            <div className="value">{player.positionalRank}</div>
                        </div>
                    </div>
                </div>
                <div className="horizontal-line"></div>
                <div className="stat-section">
                    <div className="label">SoS</div>
                    <div className="star-rating">
                        {renderStarRating(player.strengthOfSchedule)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDisplaySmall;

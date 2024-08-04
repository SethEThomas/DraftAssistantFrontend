// PlayerDisplaySmall.tsx

import React from 'react';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import { Position } from '../../enums/Position.enum';
import { Player } from '../../interfaces/Player';
import { formatNumber } from '../../util/FormatUtil';
import './PlayerDisplaySmall.css';
import { renderStarRating } from './StarRating';

interface PlayerDisplaySmallProps {
    player: Player;
    adpType: AdpType;
    platform: Platform;
}

const positionColorMapping: { [key in Position]: string } = {
    OVERALL: 'black',
    QB: 'darkred',
    WR: 'darkblue',
    TE: 'darkorange',
    RB: 'darkgreen',
    UNKNOWN: 'gray'
};

const toCamelCase = (str: string) => {
    return str
        .toLowerCase()
        .replace(/_./g, match => match[1].toUpperCase())
        .replace(/^\w/, match => match.toUpperCase())
        .replace("_","");
};

const PlayerDisplaySmall: React.FC<PlayerDisplaySmallProps> = ({ player, adpType, platform }) => {
    const backgroundColor = positionColorMapping[player.position];
    const adpField = `${Platform[platform].toLowerCase()}${toCamelCase(AdpType[adpType])}`;
    const adpValue = (player.adp as any)[adpField];

    return (
        <div className="player-display-small" style={{ backgroundColor }}>
            <div className="left-column">
                <div className="player-name">{player.firstName} {player.lastName}</div>
                <div className="player-position">{player.position} {player.teamAbbreviation}</div>
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
}

export default PlayerDisplaySmall;

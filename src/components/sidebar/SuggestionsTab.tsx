import React, { useState, useEffect, useCallback } from 'react';
import { Player } from '../../interfaces/Player';
import { DraftSettingsInterface } from '../../interfaces/DraftSettingsInterface';
import PlayerDisplaySmall, { toCamelCase } from '../player/PlayerDisplaySmall';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import { Position } from '../../enums/Position.enum';
import { usePredictions } from './PredictionsContext';
import './Suggestions.css';
import { formatNumber } from '../../util/FormatUtil';

interface SuggestionsProps {
    players: Player[];
    draftSettings: DraftSettingsInterface;
    onFavoriteToggle: (playerId: number) => void;
}

const SuggestionsTab: React.FC<SuggestionsProps> = ({ players, draftSettings, onFavoriteToggle }) => {
    const { predictions } = usePredictions();
    const [selectedCriterion, setSelectedCriterion] = useState<string>('ADP');
    const [selectedPosition, setSelectedPosition] = useState<Position | 'ALL'>('ALL');
    const [suggestions, setSuggestions] = useState<{ player: Player; vons: number }[]>([]);

    const calculateAdpField = useCallback(() => {
        return `${Platform[draftSettings.displayAdpPlatform].toLowerCase()}${toCamelCase(AdpType[draftSettings.displayAdpType])}`;
    }, [draftSettings]);

    const calculateVons = useCallback((availablePlayers: Player[]) => {
        const vons = new Map<number, number>();
        const baselineMap = new Map<Position, number>();
        const baselinePlayers = players
            .filter(player => 
                !predictions.some(prediction => prediction.id === player.id) && !player.isDrafted
            )
            .sort((a, b) => b.valueOverReplacement - a.valueOverReplacement);

        // Find one player from each position as the baseline
        baselinePlayers.forEach(player => {
            if (!baselineMap.has(player.position)) {
                baselineMap.set(player.position, player.valueOverReplacement);
            }
        });

        availablePlayers.forEach(player => {
            const baseline = baselineMap.get(player.position) || 0;
            const vonsValue = player.valueOverReplacement - baseline;
            vons.set(player.id, vonsValue);
        });

        return Array.from(vons.entries())
            .sort(([, vonsA], [, vonsB]) => vonsB - vonsA)
            .slice(0, 10)
            .map(([id, vonsValue]) => ({
                player: players.find(p => p.id === id) as Player,
                vons: vonsValue,
            }));
    }, [players, predictions]);

    const handleCriterionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCriterion(event.target.value);
    };

    const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const position = event.target.value as Position | 'ALL';
        setSelectedPosition(position);
    };

    useEffect(() => {
        let availablePlayers = players.filter(player => !player.isDrafted);

        // Filter by selected position
        if (selectedPosition !== 'ALL') {
            if (selectedPosition === 'FLEX') {
                const flexPositions = draftSettings.teamSettings.flexOptions;
                availablePlayers = availablePlayers.filter(player => flexPositions.includes(player.position));
            } else {
                availablePlayers = availablePlayers.filter(player => player.position === selectedPosition);
            }
        }

        let sortedPlayers: { player: Player; vons: number }[] = [];

        switch (selectedCriterion) {
            case 'ADP':
                const adpField = calculateAdpField();
                sortedPlayers = availablePlayers
                    .filter(player => (player.adp as any)[adpField] > 0)
                    .sort((a, b) => (a.adp as any)[adpField] - (b.adp as any)[adpField])
                    .slice(0, 10)
                    .map(player => ({ player, vons: 0 }));
                break;
            case 'Overall Rank':
                sortedPlayers = availablePlayers
                    .filter(player => player.overallRank > 0)
                    .sort((a, b) => a.overallRank - b.overallRank)
                    .slice(0, 10)
                    .map(player => ({ player, vons: 0 }));
                break;
            case 'Positional Rank':
                sortedPlayers = availablePlayers
                    .filter(player => player.positionalRank > 0)
                    .sort((a, b) => a.positionalRank - b.positionalRank)
                    .slice(0, 10)
                    .map(player => ({ player, vons: 0 }));
                break;
            case 'VONS':
                sortedPlayers = calculateVons(availablePlayers);
                break;
            default:
                sortedPlayers = [];
        }

        setSuggestions(sortedPlayers);
    }, [selectedCriterion, selectedPosition, players, predictions, calculateAdpField, calculateVons, draftSettings]);

    return (
        <div className="suggestions-tab">
            <h2>Suggestions</h2>
            <div className="input-section">
                <label htmlFor="criterion">Sort by:</label>
                <select id="criterion" value={selectedCriterion} onChange={handleCriterionChange}>
                    <option value="ADP">ADP</option>
                    <option value="Overall Rank">Overall Rank</option>
                    <option value="Positional Rank">Positional Rank</option>
                    <option value="VONS">VONS</option>
                </select>

                <label htmlFor="position">Position:</label>
                <select id="position" value={selectedPosition} onChange={handlePositionChange}>
                    <option value="ALL">OVERALL</option>
                    <option value={Position.QB}>QB</option>
                    <option value={Position.WR}>WR</option>
                    <option value={Position.RB}>RB</option>
                    <option value={Position.TE}>TE</option>
                    <option value="FLEX">FLEX</option>
                </select>
            </div>
            <div className="suggestions-list">
                {suggestions.map(({ player, vons }) => (
                    <div key={player.id} className="player-suggestion">
                        {selectedCriterion === 'VONS' && (
                            <div className="vons-value">VONS: {formatNumber(vons)}</div>
                        )}
                        <PlayerDisplaySmall 
                            player={player} 
                            adpType={draftSettings.displayAdpType} 
                            platform={draftSettings.displayAdpPlatform} 
                            hideDrafted={false}
                            onFavoriteToggle={onFavoriteToggle}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestionsTab;

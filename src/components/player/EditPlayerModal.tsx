import React, { useState } from 'react';
import './EditPlayerModal.css';
import { Player } from '../../interfaces/Player';
import axios from 'axios';
import { BACKEND_URL } from '../../util/constants';

interface EditPlayerModalProps {
    player: Player;
    onClose: () => void;
    onSubmit: (updatedPlayer: Player) => void;
}

const EditPlayerModal: React.FC<EditPlayerModalProps> = ({ player, onClose, onSubmit }) => {
    const [age, setAge] = useState<string>(player.age.toString());
    const [positionalDepth, setPositionalDepth] = useState<string>(player.positionalDepth.toString());
    const [notes, setNotes] = useState(player.notes);
    const [isSleeper, setIsSleeper] = useState(player.isSleeper);
    const [overallRank, setOverallRank] = useState<string>(player.overallRank.toString());
    const [overallTier, setOverallTier] = useState<string>(player.overallTier.toString());
    const [positionalRank, setPositionalRank] = useState<string>(player.positionalRank.toString());
    const [positionalTier, setPositionalTier] = useState<string>(player.positionalTier.toString());

    const handleSubmit = () => {
        const updatedPlayer = {
            ...player,
            age: age ? Number(age) : 0,
            positionalDepth: positionalDepth ? Number(positionalDepth) : 0,
            notes,
            isSleeper,
            overallRank: overallRank ? Number(overallRank) : 0,
            overallTier: overallTier ? Number(overallTier) : 0,
            positionalRank: positionalRank ? Number(positionalRank) : 0,
            positionalTier: positionalTier ? Number(positionalTier) : 0,
        };
        sendPlayerDataToBackend(updatedPlayer);
        onSubmit(updatedPlayer);
    };

    const sendPlayerDataToBackend = async (updatedPlayer: Player) => {
        const updateTiers = [
            { playerId: player.id, tierType: 'OVERALL', tier: overallTier ? Number(overallTier) : 0, id: player.id },
            { playerId: player.id, tierType: player.position, tier: positionalTier ? Number(positionalTier) : 0, id: player.id },
        ];
    
        const updateRanks = [
            { playerId: player.id, rankType: 'OVERALL', rank: overallRank ? Number(overallRank) : 0 },
            { playerId: player.id, rankType: player.position, rank: positionalRank ? Number(positionalRank) : 0 },
        ];
    
        try {
            axios.post(`${BACKEND_URL}/players/update`, [updatedPlayer]);
            axios.post(`${BACKEND_URL}/players/update-tiers`, updateTiers);
            axios.post(`${BACKEND_URL}/players/update-ranks`, updateRanks);

            onSubmit(updatedPlayer);
            onClose();
        } catch (error) {
            console.error('Error updating player data:', error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Edit Player</h2>
                    <button className="close-button" onClick={onClose}>x</button>
                </div>
                <div className="modal-body">
                    <label className="modal-label">
                        Age:
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </label>
                    <label className="modal-label">
                        Positional Depth:
                        <input
                            type="number"
                            value={positionalDepth}
                            onChange={(e) => setPositionalDepth(e.target.value)}
                        />
                    </label>
                    <label className="modal-label">
                        Notes:
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </label>
                    <label className="modal-label favorite-label">
                        Favorite:
                        <span
                            className={`star ${isSleeper ? 'gold' : ''}`}
                            onClick={() => setIsSleeper(!isSleeper)}
                        >
                            ★
                        </span>
                    </label>
                    <label className="modal-label">
                        Overall Rank:
                        <input
                            type="number"
                            value={overallRank}
                            onChange={(e) => setOverallRank(e.target.value)}
                        />
                    </label>
                    <label className="modal-label">
                        Overall Tier:
                        <input
                            type="number"
                            value={overallTier}
                            onChange={(e) => setOverallTier(e.target.value)}
                        />
                    </label>
                    <label className="modal-label">
                        Positional Rank:
                        <input
                            type="number"
                            value={positionalRank}
                            onChange={(e) => setPositionalRank(e.target.value)}
                        />
                    </label>
                    <label className="modal-label">
                        Positional Tier:
                        <input
                            type="number"
                            value={positionalTier}
                            onChange={(e) => setPositionalTier(e.target.value)}
                        />
                    </label>
                </div>
                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default EditPlayerModal;
import React, { useState, useEffect } from 'react';
import './ScoringSettingsModal.css';
import { ScoringSettingInterface } from '../../../interfaces/ScoringSettingInterface';

interface ScoringSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    scoringSettings: ScoringSettingInterface[];
    onSave: (updatedSettings: ScoringSettingInterface[]) => void;
}

const ScoringSettingsModal: React.FC<ScoringSettingsModalProps> = ({ isOpen, onClose, scoringSettings, onSave }) => {
    const [settings, setSettings] = useState<ScoringSettingInterface[]>(scoringSettings);
    const [initialSettings, setInitialSettings] = useState<ScoringSettingInterface[]>(scoringSettings);

    useEffect(() => {
        setSettings(scoringSettings);
        setInitialSettings(scoringSettings);
    }, [scoringSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedSettings = settings.map(setting =>
            setting.name === name ? { ...setting, pointValue: parseFloat(value) } : setting
        );
        setSettings(updatedSettings);
    };

    const getStep = (value: number): number => {
        if (value >= 1) {
            return 0.5;
        } else if (value >= 0.1) {
            return 0.05;
        } else {
            return 0.01;
        }
    };

    const handleSave = () => {
        onSave(settings);
        onClose();
    };

    const handleCancel = () => {
        setSettings(initialSettings);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Scoring Settings</h2>
                <div className="scrollable-content">
                    <form>
                        {settings.map(setting => (
                            <label key={setting.name}>
                                {setting.displayName}:
                                <input
                                    type="number"
                                    name={setting.name}
                                    value={setting.pointValue}
                                    onChange={handleChange}
                                    step={getStep(setting.pointValue)}
                                />
                            </label>
                        ))}
                    </form>
                </div>
                <div className="modal-buttons">
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScoringSettingsModal;
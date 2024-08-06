import React, { useState, useEffect } from 'react';
import './ScoringSettingsModal.css';
import { ScoringSettings } from '../../../interfaces/ScoringSettings';

interface ScoringSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    scoringSettings: ScoringSettings;
    onSave: (updatedSettings: ScoringSettings) => void;
  }
  
  const ScoringSettingsModal: React.FC<ScoringSettingsModalProps> = ({ isOpen, onClose, scoringSettings, onSave }) => {
    const [settings, setSettings] = useState<ScoringSettings>(scoringSettings);
  
    useEffect(() => {
      setSettings(scoringSettings);
    }, [scoringSettings]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSettings((prevSettings: any) => ({ ...prevSettings, [name]: parseFloat(value) }));
    };
  
    const handleSave = () => {
      onSave(settings);
      onClose();
    };
  
    const handleCancel = () => {
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Scoring Settings</h2>
          <div className="scrollable-content">
            <form>
              {Object.keys(settings).map(key => {
                let step = 1;
                if (key === 'passingYardsPoints') step = 0.01;
                else if (key === 'receivingYardsPoints' || key === 'rushingYardsPoints') step = 0.1;
                else if (key === 'teReceptionBonusPoints') step = 0.05;
                return (
                  <label key={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    <input
                      type="number"
                      name={key}
                      value={settings[key as keyof ScoringSettings] || ''}
                      onChange={handleChange}
                      step={step}
                    />
                  </label>
                );
              })}
            </form>
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="button" onClick={handleSave}>OK</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ScoringSettingsModal;
import React, { useState, useEffect } from 'react';
import './RosterSettingsModal.css';
import { RosterSettings } from '../../../interfaces/RosterSettings';
import { Position } from '../../../enums/Position.enum';

interface RosterSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    rosterSettings: RosterSettings;
    onSave: (settings: RosterSettings) => void;
  }
  
  const RosterSettingsModal: React.FC<RosterSettingsModalProps> = ({ isOpen, onClose, rosterSettings, onSave }) => {
    const [settings, setSettings] = useState<RosterSettings>(rosterSettings);
    const [initialSettings, setInitialSettings] = useState<RosterSettings>(rosterSettings);
  
    useEffect(() => {
      setSettings(rosterSettings);
      setInitialSettings(rosterSettings);
    }, [rosterSettings]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSettings(prevSettings => ({ ...prevSettings, [name]: parseInt(value) }));
    };
  
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setSettings(prevSettings => {
        const flexOptions = checked
          ? [...prevSettings.flexOptions, name as Position]
          : prevSettings.flexOptions.filter(option => option !== name);
        return { ...prevSettings, flexOptions };
      });
    };
  
    const handleSave = () => {
      onSave(settings);
      onClose();
    };
  
    const handleCancel = () => {
      setSettings(initialSettings);
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <>
        <div className="modal-backdrop" onClick={onClose}></div>
        <div className="roster-settings-modal">
          <div className="modal-content">
            <h2>Roster Settings</h2>
            <label>
              QB:
              <input
                type="number"
                name="qbSlots"
                value={settings.qbSlots}
                onChange={handleChange}
                min="0"
              />
            </label>
            <label>
              WR:
              <input
                type="number"
                name="wrSlots"
                value={settings.wrSlots}
                onChange={handleChange}
                min="0"
              />
            </label>
            <label>
              RB:
              <input
                type="number"
                name="rbSlots"
                value={settings.rbSlots}
                onChange={handleChange}
                min="0"
              />
            </label>
            <label>
              TE:
              <input
                type="number"
                name="teSlots"
                value={settings.teSlots}
                onChange={handleChange}
                min="0"
              />
            </label>
            <label>
              Flex Spots:
              <input
                type="number"
                name="flexSpots"
                value={settings.flexSpots}
                onChange={handleChange}
                min="0"
              />
            </label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="QB"
                  checked={settings.flexOptions.includes(Position.QB)}
                  onChange={handleCheckboxChange}
                />
                QB
              </label>
              <label>
                <input
                  type="checkbox"
                  name="WR"
                  checked={settings.flexOptions.includes(Position.WR)}
                  onChange={handleCheckboxChange}
                />
                WR
              </label>
              <label>
                <input
                  type="checkbox"
                  name="RB"
                  checked={settings.flexOptions.includes(Position.RB)}
                  onChange={handleCheckboxChange}
                />
                RB
              </label>
              <label>
                <input
                  type="checkbox"
                  name="TE"
                  checked={settings.flexOptions.includes(Position.TE)}
                  onChange={handleCheckboxChange}
                />
                TE
              </label>
            </div>
            <label>
              Bench Slots:
              <input
                type="number"
                name="benchSlots"
                value={settings.benchSlots}
                onChange={handleChange}
                min="0"
              />
            </label>
            <div className="button-container">
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" onClick={handleSave}>
                OK
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default RosterSettingsModal;
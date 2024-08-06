import React, { useEffect, useState } from 'react';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import { DraftSettingsInterface } from '../../interfaces/DraftSettingsInterface';
import './DraftSettings.css';
import ScoringSettingsModal from './modals/ScoringSettings';
import { ScoringSettings } from '../../interfaces/ScoringSettings';

interface DraftSettingsProps {
  draftSettings: DraftSettingsInterface;
  onSave: (settings: DraftSettingsInterface) => void;
}

const DraftSettings: React.FC<DraftSettingsProps> = ({ draftSettings, onSave }) => {
  const [settings, setSettings] = useState<DraftSettingsInterface>(draftSettings);
  const [initialSettings, setInitialSettings] = useState<DraftSettingsInterface>(draftSettings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scoringSettings, setScoringSettings] = useState<ScoringSettings>(draftSettings.scoringSettings);

  useEffect(() => {
    setSettings(draftSettings);
    setInitialSettings(draftSettings);
    setScoringSettings(draftSettings.scoringSettings);
  }, [draftSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value;
    setSettings(prevSettings => ({ ...prevSettings, [name]: newValue }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prevSettings => ({ ...prevSettings, [name]: checked }));
  };

  const handleSave = () => {
    onSave(settings);
    setInitialSettings(settings);
  };

  const handleCancel = () => {
    setSettings(initialSettings);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateScoringSettings = (updatedSettings: ScoringSettings) => {
    setScoringSettings(updatedSettings);
    setSettings(prevSettings => ({
      ...prevSettings,
      scoringSettings: updatedSettings
    }));
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  return (
    <div className="draft-settings">
      <h2>Draft Settings</h2>
      <form>
        <label>
          Number of teams:
          <input
            type="number"
            name="numTeams"
            value={settings.numTeams}
            onChange={(e) => handleChange(e)}
            min="1"
          />
        </label>
        <label>
          My team:
          <select
            name="myTeam"
            value={settings.myTeam}
            onChange={handleChange}
          >
            {Array.from({ length: settings.numTeams }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                Team {index + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Number of rounds:
          <input
            type="number"
            name="numRounds"
            value={settings.numRounds}
            onChange={handleChange}
            min="1"
          />
        </label>
        <label>
          3rd round reversal:
          <label className="switch">
            <input
              type="checkbox"
              name="thirdRoundReversal"
              checked={settings.thirdRoundReversal}
              onChange={handleToggle}
            />
            <span className="slider round"></span>
          </label>
        </label>
        <label>
          Display ADP:
          <select
            name="displayAdpType"
            value={settings.displayAdpType}
            onChange={handleChange}
          >
            {Object.values(Platform).map(platform =>
              Object.values(AdpType).map(adpType => (
                <option key={`${platform} ${adpType}`} value={`${platform} ${adpType}`}>
                  {platform} {adpType}
                </option>
              ))
            )}
          </select>
        </label>
        <div className="modal-links">
          <a href="#scoring-settings" onClick={(e) => { e.preventDefault(); handleOpenModal(); }}>
            Scoring Settings
            <i className="fas fa-external-link-alt icon"></i>
          </a>
          <a href="#team-settings" onClick={() => alert('Team Settings Modal')}>
            Team Settings
            <i className="fas fa-external-link-alt icon"></i>
          </a>
        </div>
        <div className="button-container">
          <button type="button" onClick={handleCancel} disabled={!hasChanges}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={!hasChanges}>
            Save
          </button>
        </div>
      </form>
      <ScoringSettingsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        scoringSettings={scoringSettings}
        onSave={handleUpdateScoringSettings}
      />
    </div>
  );
};

export default DraftSettings;
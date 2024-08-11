import React, { useEffect, useState } from 'react';
import { AdpType } from '../../enums/AdpType.enum';
import { Platform } from '../../enums/Platform.enum';
import { DraftSettingsInterface } from '../../interfaces/DraftSettingsInterface';
import './DraftSettings.css';
import ScoringSettingsModal from './modals/ScoringSettings';
import { ScoringSettingInterface } from '../../interfaces/ScoringSettingInterface';
import RosterSettingsModal from './modals/RosterSettingsModal';

interface DraftSettingsProps {
  draftSettings: DraftSettingsInterface;
  onSave: (settings: DraftSettingsInterface) => void;
}

const DraftSettings: React.FC<DraftSettingsProps> = ({ draftSettings, onSave }) => {
  const [settings, setSettings] = useState<DraftSettingsInterface>(draftSettings);
  const [initialSettings, setInitialSettings] = useState<DraftSettingsInterface>(draftSettings);
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [scoringSettings, setScoringSettings] = useState<ScoringSettingInterface[]>(draftSettings.scoringSettings);

  useEffect(() => {
    setSettings(draftSettings);
    setInitialSettings(draftSettings);
    setScoringSettings(draftSettings.scoringSettings);
  }, [draftSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value;

    if (name === 'displayAdpType') {
      const [platformStr, adpTypeStr] = value.split(' ');

      if (platformStr && adpTypeStr) {
        const platform = Object.values(Platform).find(p => p === platformStr);
        const adpType = Object.values(AdpType).find(a => a === adpTypeStr);

        if (platform && adpType) {
          setSettings(prevSettings => ({
            ...prevSettings,
            displayAdpType: adpType,
            displayAdpPlatform: platform,
          }));
        } else {
          console.error('Invalid platform or ADP type');
        }
      } else {
        console.error('Invalid dropdown value');
      }
    } else if (name === 'myTeam') {
      // Ensure myTeam is converted to a number
      setSettings(prevSettings => ({ ...prevSettings, myTeam: Number(newValue) }));
    } else {
      setSettings(prevSettings => ({ ...prevSettings, [name]: newValue }));
    }
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
    setScoringSettings(initialSettings.scoringSettings);
  };

  const handleOpenScoringModal = () => {
    setIsRosterModalOpen(false);
    setIsScoringModalOpen(true);
  };

  const handleCloseScoringModal = () => {
    setIsScoringModalOpen(false);
  };

  const handleOpenRosterModal = () => {
    setIsScoringModalOpen(false);
    setIsRosterModalOpen(true);
  };

  const handleCloseRosterModal = () => {
    setIsRosterModalOpen(false);
  };

  const handleUpdateScoringSettings = (updatedSettings: ScoringSettingInterface[]) => {
    setScoringSettings(updatedSettings);
    setSettings(prevSettings => ({
      ...prevSettings,
      scoringSettings: updatedSettings
    }));
  };

  const handleUpdateRosterSettings = (updatedRosterSettings: DraftSettingsInterface['teamSettings']) => {
    const newNumRounds = updatedRosterSettings.qbSlots +
                          updatedRosterSettings.rbSlots +
                          updatedRosterSettings.teSlots +
                          updatedRosterSettings.wrSlots +
                          updatedRosterSettings.flexSlots +
                          updatedRosterSettings.benchSlots;

    setSettings(prevSettings => ({
      ...prevSettings,
      teamSettings: updatedRosterSettings,
      numRounds: newNumRounds,
    }));
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  useEffect(() => {
    if (isScoringModalOpen || isRosterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isScoringModalOpen, isRosterModalOpen]);

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
            onChange={handleChange}
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
          <div className="number-of-rounds">
            {settings.numRounds}
          </div>
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
            value={`${settings.displayAdpPlatform} ${settings.displayAdpType}`}
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
          <a href="#scoring-settings" onClick={(e) => { e.preventDefault(); handleOpenScoringModal(); }}>
            Scoring Settings
            <i className="fas fa-external-link-alt icon"></i>
          </a>
          <a href="#roster-settings" onClick={(e) => { e.preventDefault(); handleOpenRosterModal(); }}>
            Roster Settings
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
        isOpen={isScoringModalOpen}
        onClose={handleCloseScoringModal}
        scoringSettings={scoringSettings}
        onSave={handleUpdateScoringSettings}
      />
      <RosterSettingsModal
        isOpen={isRosterModalOpen}
        onClose={handleCloseRosterModal}
        rosterSettings={settings.teamSettings}
        onSave={handleUpdateRosterSettings}
      />
    </div>
  );
};

export default DraftSettings;

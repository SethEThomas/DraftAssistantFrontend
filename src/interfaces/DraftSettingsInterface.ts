import { AdpType } from "../enums/AdpType.enum";
import { RosterSettings } from "./RosterSettings";
import { Platform } from "../enums/Platform.enum";
import { ScoringSettingInterface } from "./ScoringSettingInterface";

export interface DraftSettingsInterface{
    numTeams: number;
    myTeam: number;
    numRounds: number;
    thirdRoundReversal: boolean;
    displayAdpType: AdpType;
    displayAdpPlatform: Platform;
    scoringSettings: ScoringSettingInterface[];
    teamSettings: RosterSettings;
}
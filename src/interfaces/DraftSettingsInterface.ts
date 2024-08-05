import { AdpType } from "../enums/AdpType.enum";
import { ScoringSettings } from "./ScoringSettings";
import { RosterSettings } from "./RosterSettings";
import { Platform } from "../enums/Platform.enum";

export interface DraftSettingsInterface{
    numTeams: number;
    myTeam: number;
    numRounds: number;
    thirdRoundReversal: boolean;
    displayAdpType: AdpType;
    displayAdpPlatform: Platform;
    scoringSettings: ScoringSettings;
    teamSettings: RosterSettings;
}
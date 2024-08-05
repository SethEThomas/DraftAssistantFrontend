import { AdpType } from "../enums/AdpType.enum";
import { ScoringSettings } from "./ScoringSettings";
import { RosterSettings } from "./RosterSettings";

export interface DraftSettings{
    numTeams: number;
    myTeam: number;
    numRounds: number;
    thirdRoundReversal: boolean;
    displayAdp: AdpType;
    scoringSettings: ScoringSettings;
    teamSettings: RosterSettings;
}
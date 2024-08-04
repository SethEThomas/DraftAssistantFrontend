import { SingleStat } from "./SingleStat";

export interface AggregateStat{
    completionPct: SingleStat;
    passing2Pt: SingleStat;
    passAttempt: SingleStat;
    passCompletion: SingleStat;
    passingFirstDown: SingleStat;
    passingInterception: SingleStat;
    passingTd: SingleStat;
    passingYard: SingleStat;
    fumble: SingleStat;
    receiving2Pt: SingleStat;
    reception: SingleStat;
    reception40Plus: SingleStat;
    receptionFirstDown: SingleStat;
    receivingTd: SingleStat;
    receivingYard: SingleStat;
    rushing2Pt: SingleStat;
    rushingAttempt: SingleStat;
    rushingFirstDown: SingleStat;
    rushingTd: SingleStat;
    rushingYard: SingleStat;
    teReceptionBonus: SingleStat;
    totalProjectedPoints: number;
}
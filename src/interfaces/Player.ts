import { AggregateAdp } from "./AggregateAdp";
import { AggregateStat } from "./AggregateStat";

export interface Player {
    id: number;
    normalizedName: string;
    firstName: string;
    lastName: string;
    age: number;
    positionalDepth: number;
    notes: string;
    isSleeper: boolean;
    ecr: number;
    position: number;
    teamName: string;
    teamAbbreviation: string;
    byeWeek: number;
    strenghOfSchedule: number;
    overallTier: number;
    positionalTier: number;
    overallRank: number;
    positionalRank: number;
    adp: AggregateAdp;
    stats: AggregateStat;
  }
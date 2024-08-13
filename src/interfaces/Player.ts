import { Position } from "../enums/Position.enum";
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
    position: Position;
    teamName: string;
    teamAbbreviation: string;
    byeWeek: number;
    strengthOfSchedule: number;
    overallTier: number;
    positionalTier: number;
    overallRank: number;
    positionalRank: number;
    adp: AggregateAdp;
    stats: AggregateStat;
    totalProjectedPoints: number;
    formattedPickNumber: string;
    isDrafted: boolean;
  }
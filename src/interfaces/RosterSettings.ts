import { Position } from "../enums/Position.enum";

export interface RosterSettings {
    qbSlots: number;
    wrSlots: number;
    rbSlots: number;
    teSlots: number;
    flexSlots: number;
    flexOptions: Position[];
    benchSlots: number;
}
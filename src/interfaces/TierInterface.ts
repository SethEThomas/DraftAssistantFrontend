import { Player } from "./Player";

export interface Tier{
    tierName: string;
    tierNumber: number;
    players: Player[];
}
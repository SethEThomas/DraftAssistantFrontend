import { AggregateAdp } from "../interfaces/AggregateAdp";
import { AggregateStat } from "../interfaces/AggregateStat";
import { Player } from "../interfaces/Player";
import { SingleStat } from "../interfaces/SingleStat";

export function formatNumber(value: number | undefined): number {
    return value !== undefined ? parseFloat(value.toFixed(2)) : -1.00;
}

function formatAggregateAdp(adp: AggregateAdp): AggregateAdp {
    return {
        sleeperStandard: formatNumber(adp.sleeperStandard),
        espnStandard: formatNumber(adp.espnStandard),
        fantraxStandard: formatNumber(adp.fantraxStandard),
        nffcStandard: formatNumber(adp.nffcStandard),
        underdogStandard: formatNumber(adp.underdogStandard),
        sleeperHalfPpr: formatNumber(adp.sleeperHalfPpr),
        espnHalfPpr: formatNumber(adp.espnHalfPpr),
        fantraxHalfPpr: formatNumber(adp.fantraxHalfPpr),
        nffcHalfPpr: formatNumber(adp.nffcHalfPpr),
        underdogHalfPpr: formatNumber(adp.underdogHalfPpr),
        sleeperPpr: formatNumber(adp.sleeperPpr),
        espnPpr: formatNumber(adp.espnPpr),
        fantraxPpr: formatNumber(adp.fantraxPpr),
        nffcHpr: formatNumber(adp.nffcHpr),
        underdogPpr: formatNumber(adp.underdogPpr),
        sleeper2Qb: formatNumber(adp.sleeper2Qb),
        espnH2Qb: formatNumber(adp.espnH2Qb),
        fantrax2Qb: formatNumber(adp.fantrax2Qb),
        nffc2Qb: formatNumber(adp.nffc2Qb),
        underdog2Qb: formatNumber(adp.underdog2Qb),
        sleeperDynastyStandard: formatNumber(adp.sleeperDynastyStandard),
        espnDynastyStandard: formatNumber(adp.espnDynastyStandard),
        fantraxDynastyStandard: formatNumber(adp.fantraxDynastyStandard),
        nffcDynastyStandard: formatNumber(adp.nffcDynastyStandard),
        underdogDynastyStandard: formatNumber(adp.underdogDynastyStandard),
        sleeperDynastyHalfPpr: formatNumber(adp.sleeperDynastyHalfPpr),
        espnDynastyHalfPpr: formatNumber(adp.espnDynastyHalfPpr),
        fantraxDynastyHalfPpr: formatNumber(adp.fantraxDynastyHalfPpr),
        nffcDynastyHalfPpr: formatNumber(adp.nffcDynastyHalfPpr),
        underdogDynastyHalfPpr: formatNumber(adp.underdogDynastyHalfPpr),
        sleeperDynastyPpr: formatNumber(adp.sleeperDynastyPpr),
        espnDynastyPpr: formatNumber(adp.espnDynastyPpr),
        fantraxDynastyPpr: formatNumber(adp.fantraxDynastyPpr),
        nffcDynastyHpr: formatNumber(adp.nffcDynastyHpr),
        underdogDynastyPpr: formatNumber(adp.underdogDynastyPpr),
        sleeperDynasty2Qb: formatNumber(adp.sleeperDynasty2Qb),
        espnDynasty2Qb: formatNumber(adp.espnDynasty2Qb),
        fantraxDynasty2Qb: formatNumber(adp.fantraxDynasty2Qb),
        nffcDynasty2Qb: formatNumber(adp.nffcDynasty2Qb),
        underdogDynasty2Qb: formatNumber(adp.underdogDynasty2Qb)
    };
}

function formatAggregateStat(stats: AggregateStat): AggregateStat {
    return {
        completionPct: formatSingleStat(stats.completionPct),
        passing2Pt: formatSingleStat(stats.passing2Pt),
        passAttempt: formatSingleStat(stats.passAttempt),
        passCompletion: formatSingleStat(stats.passCompletion),
        passingFirstDown: formatSingleStat(stats.passingFirstDown),
        passingInterception: formatSingleStat(stats.passingInterception),
        passingTd: formatSingleStat(stats.passingTd),
        passingYard: formatSingleStat(stats.passingYard),
        fumble: formatSingleStat(stats.fumble),
        receiving2Pt: formatSingleStat(stats.receiving2Pt),
        reception: formatSingleStat(stats.reception),
        reception40Plus: formatSingleStat(stats.reception40Plus),
        receptionFirstDown: formatSingleStat(stats.receptionFirstDown),
        receivingTd: formatSingleStat(stats.receivingTd),
        receivingYard: formatSingleStat(stats.receivingYard),
        rushing2Pt: formatSingleStat(stats.rushing2Pt),
        rushingAttempt: formatSingleStat(stats.rushingAttempt),
        rushingFirstDown: formatSingleStat(stats.rushingFirstDown),
        rushingTd: formatSingleStat(stats.rushingTd),
        rushingYard: formatSingleStat(stats.rushingYard),
        teReceptionBonus: formatSingleStat(stats.teReceptionBonus),
        totalProjectedPoints: formatNumber(stats.totalProjectedPoints)
    };
}

export function formatSingleStat(stat: SingleStat){
    return{
        projectedAmount: formatNumber(stat.projectedAmount),
        projectedPoints: formatNumber(stat.projectedPoints)
    }
}

export function formatPlayer(player: Player): Player {
    return {
        ...player,
        age: formatNumber(player.age),
        positionalDepth: formatNumber(player.positionalDepth),
        ecr: formatNumber(player.ecr),
        strengthOfSchedule: formatNumber(player.strengthOfSchedule),
        overallTier: formatNumber(player.overallTier),
        positionalTier: formatNumber(player.positionalTier),
        overallRank: formatNumber(player.overallRank),
        positionalRank: formatNumber(player.positionalRank),
        adp: formatAggregateAdp(player.adp),
        stats: formatAggregateStat(player.stats)

    };
}

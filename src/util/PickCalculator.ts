export function calculateTeamPick(pickNumber: number, numTeams: number, thirdRoundReversal: boolean): number {
    const roundNumber = Math.ceil(pickNumber / numTeams);
    const positionInRound = (pickNumber - 1) % numTeams;

    if (thirdRoundReversal) {
        if (roundNumber % 2 === 1) {
            return roundNumber < 3 ? positionInRound + 1 : numTeams - positionInRound;
        } else {
            return roundNumber < 3 ? numTeams - positionInRound : positionInRound + 1;
        }
    } else {
        if (roundNumber % 2 === 1) {
            return positionInRound + 1;
        } else {
            return numTeams - positionInRound;
        }
    }
}

export function formatPickNumber(pickNumber: number, numTeams: number): string {
    const roundNumber = Math.ceil(pickNumber / numTeams);
    const pickInRound = ((pickNumber - 1) % numTeams) + 1;
    return `${roundNumber}.${pickInRound}`;
}

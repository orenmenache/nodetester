import { AllSports__Team } from '../Teams';
import { AllSports__Tournament } from '../UniqueTournaments';

interface RoundInfo {
    round: string;
}

interface Status {
    code: string;
    description: string;
    type: string;
}

interface Score {
    current: string;
    display: string;
    period1: string;
    period2: string;
    normaltime: string;
}

interface Time {
    injuryTime1: string;
    injuryTime2: string;
    currentPeriodStartTimestamp: string;
}

interface Changes {
    changes: string[];
    changeTimestamp: string;
}

export interface AllSports__LastMatch {
    tournament: { uniqueTournament: AllSports__Tournament };
    roundInfo: RoundInfo;
    customId: string;
    status: Status;
    winnerCode: string;
    homeTeam: AllSports__Team;
    awayTeam: AllSports__Team;
    homeScore: Score;
    awayScore: Score;
    time: Time;
    changes: Changes;
    hasGlobalHighlights: boolean;
    hasXg: boolean;
    hasEventPlayerStatistics: boolean;
    hasEventPlayerHeatMap: boolean;
    detailId: string;
    crowdsourcingDataDisplayEnabled: boolean;
    id: string;
    crowdsourcingEnabled: boolean;
    startTimestamp: string;
    slug: string;
    finalResultOnly: boolean;
    isEditor: boolean;
}

export interface DB__LastMatch {
    tournament_id: string;
    round: string;
    winnerCode: string;
    homeTeamId: string;
    awayTeamId: string;
    homeScore: string;
    awayScore: string;
    id: string;
    startTimestamp: string;
    slug: string;
}

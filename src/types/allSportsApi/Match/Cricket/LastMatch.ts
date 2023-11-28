import { AllSports__Team } from '../../Teams';
import { AllSports__Tournament } from '../../UniqueTournaments';

interface Status {
    code: string;
    description: string;
    type: string;
}

interface Inning {
    score: string;
    wickets: string;
    overs: string;
}

interface CricketScore {
    current: string;
    display: string;
    innings: { [key: string]: Inning };
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
    customId: string;
    status: Status;
    winnerCode: string;
    homeTeam: AllSports__Team;
    awayTeam: AllSports__Team;
    homeScore: CricketScore;
    awayScore: CricketScore;
    time: Time;
    changes: Changes;
    coverage: string;
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
    note: string;
}

export interface DB__LastMatch {
    tournament_id: string;
    winnerCode: string;
    homeTeamId: string;
    homeTeamName: string;
    awayTeamId: string;
    awayTeamName: string;
    homeScore: string;
    awayScore: string;
    id: string;
    startTimestamp: string;
    slug: string;
    note: string;
}

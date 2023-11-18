import { AxiosResponse } from 'axios';
import { AllSports__Player } from './Player';
import { AllSports__Team } from './Teams';

export interface AllSports__Statistics {
    id: number;
    innings: number;
    battingInnings: number;
    battingMatches: number;
    runsScored: number;
    hundreds: number;
    matches: number;
    type: string;
    appearances: number;
    playedEnough: boolean;
}

export interface DB__Statistics {
    // id: number;
    innings: number;
    battingInnings: number;
    battingMatches: number;
    runsScored: number;
    hundreds: number;
    matches: number;
    type: string;
    appearances: number;
    category: AllSports__TopPlayerCategories;
    playerId: number;
    teamId: number;
    leagueSeasonId: number;
}

export interface AllSports__TopPlayerBundle {
    statistics: AllSports__Statistics;
    player: AllSports__Player;
    team: AllSports__Team;
}

export type AllSports__TopPlayerCategories =
    | 'runsScored'
    | 'battingAverage'
    | 'battingStrikeRate'
    | 'hundreds'
    | 'fifties'
    | 'fours'
    | 'sixes'
    | 'nineties'
    | 'wickets'
    | 'bowlingAverage'
    | 'fiveWicketsHaul'
    | 'economy'
    | 'bowlingStrikeRate';

export type AllSports__TopPlayersAPIResponse = AxiosResponse<{
    topPlayers: {
        [key in AllSports__TopPlayerCategories]: AllSports__TopPlayerBundle[];
    };
}>;

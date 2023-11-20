import { AxiosResponse } from 'axios';
import { AllSports__Player } from './Player';
import { AllSports__Team } from './Teams';

export interface AllSports__Statistics {
    id: string;
    innings: string;
    battingInnings: string;
    battingMatches: string;
    runsScored: string;
    hundreds: string;
    matches: string;
    type: string;
    appearances: string;
    playedEnough: boolean;
}

export interface DB__Statistics {
    // id: string;
    innings: string;
    battingInnings: string;
    battingMatches: string;
    runsScored: string;
    hundreds: string;
    matches: string;
    type: string;
    appearances: string;
    category: AllSports__TopPlayerCategories;
    playerId: string;
    teamId: string;
    leagueSeasonId: string;
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

import { AxiosResponse } from 'axios';

export interface AllSports__Player {
    id: number;
    name: string;
    slug: string;
    shortName: string;
    position: string;
    userCount: number;
}

export interface AllSports__Team {
    id: number;
    name: string;
    slug: string;
    shortName: string;
    userCount: number;
    type: number;
}

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

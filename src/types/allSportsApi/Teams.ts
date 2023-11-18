import { AxiosResponse } from "axios";

/**
 * We'll be getting the teams via the standings
 */
export type AllSports__StandingsResponse = AxiosResponse<{standings: {rows: AllSports__TeamStandings[]}[]}>;

export type AllSports__TeamStandings = {
    team: AllSports__Team;
    position: number;
    matches: number;
    wins: number;
    netRunRate: number;
    id: number;
    losses: number;
    draws: number;
    points: number;
}

export interface AllSports__Team {
    id: number;
    name: string;
    slug: string;
    shortName: string;
    userCount: number;
    type: number;
}

export interface DB__Team {
    id: number;
    name: string;
    slug: string;
    shortName: string;
    userCount: number;
    type: number;
    leagueSeasonId: number;
}
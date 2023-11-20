import { AxiosResponse } from 'axios';

/**
 * We'll be getting the teams via the standings
 */
export type AllSports__StandingsResponse = AxiosResponse<{
    standings: { rows: AllSports__TeamStandings[] }[];
}>;

export type AllSports__TeamStandings = {
    team: AllSports__Team;
    position: string;
    matches: string;
    wins: string;
    netRunRate: string;
    id: string;
    losses: string;
    draws: string;
    points: string;
};

export interface AllSports__Team {
    id: string;
    name: string;
    slug: string;
    shortName: string;
    userCount: string;
    type: string;
}

export interface DB__Team {
    id: string;
    name: string;
    slug: string;
    shortName: string;
    userCount: string;
    type: string;
    leagueSeasonId: string;
}

import { AxiosResponse } from "axios";

export interface AllSports__Player {
    id: number;
    name: string;
    slug: string;
    shortName: string;
    position: string;
    userCount: number;
}

export interface DB__Player {
    id: number;
    name: string;
    slug: string;
    shortName: string;
    position: string;
    userCount: number;
    teamId: number;
}

export type AllSports__TeamPlayersAPIResponse = AxiosResponse<{
    players: {player: AllSports__Player}[],
    foreignPlayers: {player: AllSports__Player}[],
    nationalPlayers: {player: AllSports__Player}[],
}>
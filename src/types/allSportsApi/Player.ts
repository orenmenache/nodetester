import { AxiosResponse } from 'axios';

export interface AllSports__Player {
    id: string;
    name: string;
    slug: string;
    shortName: string;
    position: string;
    userCount: string;
}

export interface DB__Player {
    id: string;
    name: string;
    slug: string;
    shortName: string;
    position: string;
    userCount: string;
    teamId: string;
}

export type AllSports__TeamPlayersAPIResponse = AxiosResponse<{
    players: { player: AllSports__Player }[];
    foreignPlayers: { player: AllSports__Player }[];
    nationalPlayers: { player: AllSports__Player }[];
}>;

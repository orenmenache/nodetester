export type AllSports__LeagueSeason = {
    id: number;
    name: string;
    editor: boolean;
    year: string;
};

export type DB__LeagueSeason = {
    id: number;
    name: string;
    editor: boolean;
    year: number;
    tournament_id: number;
};

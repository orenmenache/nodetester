export type AllSports__LeagueSeason = {
    id: string;
    name: string;
    editor: boolean;
    year: string;
};

export type DB__LeagueSeason = {
    id: string;
    name: string;
    editor: boolean;
    year: string;
    tournament_id: string;
};

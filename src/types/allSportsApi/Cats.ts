export type AllSports__Category = {
    id: number;
    name: string;
    slug: string;
    priority: number;
    flag: string;
    alpha2: string;
    sport: {
        id: number;
        name: string;
        slug: string;
    };
};

export type DB__Category = {
    id: number;
    name: string;
    slug: string;
    priority: number;
    flag: string;
    alpha2: string;
    sport_id: number;
};

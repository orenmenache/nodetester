export type AllSports__Category = {
    id: string;
    name: string;
    slug: string;
    priority: string;
    flag: string;
    alpha2: string;
    sport: {
        id: string;
        name: string;
        slug: string;
    };
};

export type DB__Category = {
    id: string;
    name: string;
    slug: string;
    priority: string;
    flag: string;
    alpha2: string;
    sport_id: string;
};

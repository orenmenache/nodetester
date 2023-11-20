import { AllSports__Category } from './Cats';

export type AllSports__Tournament = {
    id: string;
    name: string;
    slug: string;
    primaryColorHex: string;
    secondaryColorHex: string;
    category: AllSports__Category;
    userCount: string;
};

export type DB__Tournament = {
    id: string;
    name: string;
    slug: string;
    primaryColorHex: string;
    secondaryColorHex: string;
    category_id: string;
    userCount: string;
};

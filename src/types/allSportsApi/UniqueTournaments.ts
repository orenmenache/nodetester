import { AllSports__Category } from './Cats';

export type AllSports__Tournament = {
    id: number;
    name: string;
    slug: string;
    primaryColorHex: string;
    secondaryColorHex: string;
    category: AllSports__Category;
    userCount: number;
    displayInverseHomeAwayTeams: boolean;
};

export type DB__Tournament = {
    id: number;
    name: string;
    slug: string;
    primaryColorHex: string;
    secondaryColorHex: string;
    category_id: number;
    userCount: number;
    displayInverseHomeAwayTeams: boolean;
};

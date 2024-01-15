import { allSportsAPIURLs } from './allSportsAPIURLs';
import * as dotenv from 'dotenv';
dotenv.config();

export const headers: { [key: string]: string } = {
    'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
    'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
};

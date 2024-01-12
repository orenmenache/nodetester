import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { MYSQL_DB } from '../../../classes/MYSQL_DB/MYSQL_DB';
import { TABLES } from '../../../config/NAMES';
import { allSportsAPIURLs } from '../../../config/allSportsAPIURLs';
import { DB__Category } from '../../../types/allSportsApi/Cats';
import {
    AllSports__Tournament,
    DB__Tournament,
} from '../../../types/allSportsApi/UniqueTournaments';
import { DB } from '../../../types/namespaces/DB';
import { ASA } from '../../../types/namespaces/ASA';
dotenv.config();

/**
 * CORE__CATEGORIES must be populated first
 * or run getCategories
 */
export async function getTournamentsByCategory__FOOTBALL(DB: MYSQL_DB) {
    const funcName = `getTournamentsByCategory__FOOTBALL`;
    try {
        // await DB.cleanTable(TABLES.footballTournaments.name);

        const categories: DB.Category[] = await DB.SELECT<DB.Category>(
            TABLES.footballCategories.name
        );
        for (const category of categories) {
            console.log(`category.name: ${category.name}`);

            const url = `${allSportsAPIURLs.FOOTBALL.tournaments}${category.id}`;
            const headers = {
                'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
                'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
            };

            const axiosRequest = {
                method: 'GET',
                url,
                headers,
            };

            const response: AxiosResponse<{
                groups: { uniqueTournaments: ASA.Tournament[] }[];
            }> = await axios.request(axiosRequest);

            const tournaments: ASA.Tournament[] =
                response.data.groups[0].uniqueTournaments;

            // map ASA.Tournament to DB.Tournament
            const tournamentsDB: DB.Tournament[] = tournaments.map(
                (tournament: ASA.Tournament) => ({
                    id: tournament.id,
                    name: tournament.name,
                    slug: tournament.slug,
                    primaryColorHex: tournament.primaryColorHex,
                    secondaryColorHex: tournament.secondaryColorHex,
                    userCount: tournament.userCount,
                    category_id: tournament.category.id,
                })
            );

            console.log(`Tournaments: ${tournamentsDB.length}`);

            const insertResult = await DB.INSERT_BATCH<DB.Tournament>(
                tournamentsDB,
                TABLES.footballTournaments.name,
                true
            );
            console.log(
                `Insert result: ${insertResult} for category: ${category.id} ${category.name}`
            );
        }
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

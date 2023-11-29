import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLE_NAMES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB__Category } from '../../types/allSportsApi/Cats';
import {
    AllSports__Tournament,
    DB__Tournament,
} from '../../types/allSportsApi/UniqueTournaments';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * CORE__CATEGORIES must be populated first
 * or run getCategories
 */
export async function getTournamentsByCategory__FOOTBALL(DB: MYSQL_DB) {
    const funcName = `getTournamentsByCategory__FOOTBALL`;
    try {
        await DB.cleanTable(TABLE_NAMES.footballTournaments.name);

        const categories: DB__Category[] = await DB.SELECT<DB__Category>(
            TABLE_NAMES.footballCategories.name
        );
        for (const category of categories) {
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
                groups: { uniqueTournaments: AllSports__Tournament[] }[];
            }> = await axios.request(axiosRequest);

            const tournaments: AllSports__Tournament[] =
                response.data.groups[0].uniqueTournaments;

            const tournamentsDB: DB__Tournament[] = tournaments.map(
                (tournament: AllSports__Tournament) => ({
                    id: tournament.id,
                    name: tournament.name,
                    slug: tournament.slug,
                    primaryColorHex: tournament.primaryColorHex,
                    secondaryColorHex: tournament.secondaryColorHex,
                    userCount: tournament.userCount,
                    category_id: tournament.category.id,
                })
            );

            const insertResult = await DB.INSERT_BATCH<DB__Tournament>(
                tournamentsDB,
                TABLE_NAMES.footballTournaments.name,
                false
            );
            console.log(
                `Insert result: ${insertResult} for category: ${category.id} ${category.name}`
            );
        }
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

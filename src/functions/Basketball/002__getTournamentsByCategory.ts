import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { ASA } from '../../types/namespaces/ASA';
import { DB } from '../../types/namespaces/DB';
import { headers } from '../../config/HEADERS';
dotenv.config();

/**
 * CORE__CATEGORIES must be populated first
 * or run getCategories
 */
export async function getTournamentsByCategory__BASKETBALL(DB: MYSQL_DB) {
    const funcName = `getTournamentsByCategory__BASKETBALL`;
    try {
        const categories: DB.Category[] = await DB.SELECT<DB.Category>(
            TABLES.basketballCategories.name
        );
        for (const category of categories) {
            console.log(`category.name: ${category.name}`);

            const url = `${allSportsAPIURLs.BASKETBALL.tournaments}${category.id}`;

            const axiosRequest = {
                method: 'GET',
                url,
                headers,
            };

            const response: AxiosResponse<{
                groups: { uniqueTournaments: ASA.Tournament[] }[];
            }> = await axios.request(axiosRequest);

            console.log(JSON.stringify(response.data, null, 4));

            const tournaments: ASA.Tournament[] =
                response.data.groups[0].uniqueTournaments;

            // map ASA.Tournament to DB.Tournament
            const tournamentsDB: DB.Tournament[] = tournaments.map(
                (tournament: ASA.Tournament) => ({
                    id: tournament.id,
                    name: tournament.name,
                    slug: tournament.slug,
                    category_id: tournament.category.id,
                })
            );

            console.log(`Tournaments: ${tournamentsDB.length}`);

            const insertResult = await DB.INSERT_BATCH<DB.Tournament>(
                tournamentsDB,
                TABLES.basketballTournaments.name,
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

import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import {
    AllSports__Tournament,
    DB__Tournament,
} from '../../types/allSportsApi/UniqueTournaments';
import * as dotenv from 'dotenv';
import { DB } from '../../types/namespaces/DB';
import { ASA } from '../../types/namespaces/ASA';
dotenv.config();

/**
 * CORE__CATEGORIES must be populated first
 * or run getCategories
 */
export async function getTournamentsByCategory__CRICKET(DB: MYSQL_DB) {
    const funcName = `getTournamentsByCategory__CRICKET`;
    try {
        await DB.cleanTable(TABLES.cricketTournaments.name);

        const categories: DB.Category[] = await DB.SELECT<DB.Category>(
            TABLES.cricketCategories.name
        );

        for (const category of categories) {
            const url = `${allSportsAPIURLs.CRICKET.tournaments}${category.id}`;
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

            // console.log(JSON.stringify(response.data.groups, null, 4));
            // return;
            for (const group of response.data.groups) {
                const tournaments: ASA.Tournament[] = group.uniqueTournaments;

                const filteredTournaments: ASA.Tournament[] =
                    tournaments.filter(
                        (tournament: ASA.Tournament) =>
                            !tournament.name.toLowerCase().includes('women')
                    );

                const tournamentsDB: DB.Tournament[] = filteredTournaments.map(
                    (tournament: ASA.Tournament) => ({
                        id: tournament.id,
                        name: tournament.name,
                        slug: tournament.slug,
                        category_id: tournament.category.id,
                    })
                );

                const insertResult = await DB.INSERT_BATCH<DB.Tournament>(
                    tournamentsDB,
                    TABLES.cricketTournaments.name,
                    true
                );
                console.log(
                    `Insert result: ${insertResult} for category: ${category.id} ${category.name}`
                );
            }
        }
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

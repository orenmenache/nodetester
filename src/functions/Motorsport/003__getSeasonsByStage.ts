import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import * as dotenv from 'dotenv';
import { DB } from '../../types/namespaces/DB';
import { headers } from '../../config/HEADERS';
import { ASA } from '../../types/namespaces/ASA';
import { formatDateToSQLTimestamp } from '../GEN/formatToMySQLTimestamp';
dotenv.config();

/**
 * Builds on categories
 * Tested 201123
 */
export async function getSeasonsByStage__MOTORSPORT(DB: MYSQL_DB) {
    const funcName = `getSeasonsByStage__MOTORSPORT`;
    try {
        // await DB.cleanTable(TABLES.motorsportSeasons.name);
        // return;
        const stages: DB.Tournament[] = await DB.SELECT<DB.Tournament>(
            TABLES.motorsportStages.name
        );

        for (const stage of stages) {
            const url = allSportsAPIURLs.MOTORSPORT.seasons.replace(
                'stageId',
                stage.id.toString()
            );

            const axiosRequest = {
                method: 'GET',
                url,
                headers,
            };

            const response: AxiosResponse<{
                seasons: ASA.Motorsport.Season[];
            }> = await axios.request(axiosRequest);

            const seasons: ASA.Motorsport.Season[] = response.data.seasons;

            if (seasons.length === 0 || !seasons) {
                throw `No seasons for stage: ${stage.id} ${stage.name}`;
            }

            const seasonsDB: DB.Motorsport.Season[] = seasons.map(
                //const leagueSeasonsDB: DB__LeagueSeason[] = leagueSeasons.map(
                (season: ASA.Motorsport.Season) => ({
                    id: season.id,
                    slug: season.slug,
                    description: season.description,
                    name: season.name,
                    year: season.year,
                    stage_id: stage.id,
                    category_id: stage.category_id,
                    start_date: formatDateToSQLTimestamp(
                        new Date(Number(season.startDateTimestamp) * 1000)
                    ),
                    end_date: formatDateToSQLTimestamp(
                        new Date(Number(season.endDateTimestamp) * 1000)
                    ),
                })
            );

            const insertResult = await DB.INSERT_BATCH<DB.Motorsport.Season>(
                seasonsDB,
                TABLES.motorsportSeasons.name,
                true
            );
            console.log(
                `Insert result: ${insertResult} for stage: ${stage.id} ${stage.name}`
            );
        }
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

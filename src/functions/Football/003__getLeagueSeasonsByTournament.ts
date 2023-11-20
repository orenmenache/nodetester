import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLE_NAMES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB__Tournament } from '../../types/allSportsApi/UniqueTournaments';
import {
    AllSports__LeagueSeason,
    DB__LeagueSeason,
} from '../../types/allSportsApi/Seasons';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Builds on categories
 * Tested 201123
 */
export async function getLeagueSeasonsByTournament__FOOTBALL(DB: MYSQL_DB) {
    const funcName = `getLeagueSeasonsByTournament__FOOTBALL`;
    try {
        await DB.cleanTable(TABLE_NAMES.footballLeagueSeasons);

        const now = new Date();
        const thisYear = now.getFullYear();

        const tournaments: DB__Tournament[] = await DB.SELECT<DB__Tournament>(
            TABLE_NAMES.footballTournaments
        );

        for (const tournament of tournaments) {
            try {
                const url = allSportsAPIURLs.FOOTBALL.leagueseasons.replace(
                    'tournamentId',
                    tournament.id.toString()
                );
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
                    seasons: AllSports__LeagueSeason[];
                }> = await axios.request(axiosRequest);

                const leagueSeasons: AllSports__LeagueSeason[] =
                    response.data.seasons;

                if (leagueSeasons.length === 0 || !leagueSeasons) {
                    console.log(
                        `%cNo seasons for tournament: ${tournament.id} ${tournament.name}`,
                        'color: yellow'
                    );
                    continue;
                }

                const filtered = leagueSeasons.filter(
                    (season: AllSports__LeagueSeason) =>
                        Number(season.year) >= thisYear
                );

                if (filtered.length === 0) {
                    console.warn(
                        `No leagues THIS YEAR or NEXT YEAR for tournament: ${JSON.stringify(
                            tournament
                        )}`
                    );
                    continue;
                }

                const leagueSeasonsDB: DB__LeagueSeason[] = filtered.map(
                    //const leagueSeasonsDB: DB__LeagueSeason[] = leagueSeasons.map(
                    (leagueSeason: AllSports__LeagueSeason) => ({
                        id: leagueSeason.id,
                        name: leagueSeason.name,
                        editor: leagueSeason.editor,
                        year: Number(leagueSeason.year),
                        tournament_id: tournament.id,
                    })
                );

                const insertResult = await DB.INSERT_BATCH<DB__LeagueSeason>(
                    leagueSeasonsDB,
                    TABLE_NAMES.footballLeagueSeasons,
                    true
                );
                console.log(
                    `Insert result: ${insertResult} for tournament: ${tournament.id} ${tournament.name}`
                );
            } catch (e) {
                console.log(
                    `%cFailed to get data for tournament: ${tournament.id} ${tournament.name}`,
                    'color: orange'
                );
            }
        }
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

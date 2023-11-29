import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLES } from '../../config/NAMES';
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
        await DB.cleanTable(TABLES.footballLeagueSeasons.name);

        const now = new Date();
        const thisYear = now.getFullYear();
        let dudTournaments: DB__Tournament[] = [];
        let greenTournaments: DB__Tournament[] = [];

        const tournaments: DB__Tournament[] = await DB.SELECT<DB__Tournament>(
            TABLES.footballTournaments.name
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
                    throw `No seasons for tournament: ${tournament.id} ${tournament.name}`;
                }

                const filtered = leagueSeasons.filter(
                    (season: AllSports__LeagueSeason) =>
                        Number(season.year) >= thisYear ||
                        season.year === '23/24' ||
                        season.year === '22/23'
                );

                if (filtered.length === 0) {
                    throw `No leagues THIS YEAR or NEXT YEAR for tournament: ${JSON.stringify(
                        tournament
                    )}`;
                }

                const leagueSeasonsDB: DB__LeagueSeason[] = filtered.map(
                    //const leagueSeasonsDB: DB__LeagueSeason[] = leagueSeasons.map(
                    (leagueSeason: AllSports__LeagueSeason) => ({
                        id: leagueSeason.id,
                        name: leagueSeason.name,
                        editor: leagueSeason.editor,
                        year: leagueSeason.year,
                        tournament_id: tournament.id,
                        hasLastMatches: false, // will be updated in getLastMatches
                        hasNextMatches: false, // will be updated in getNextMatches
                        women:
                            leagueSeason.name.toLowerCase().indexOf('women') >
                            -1,
                    })
                );

                const insertResult = await DB.INSERT_BATCH<DB__LeagueSeason>(
                    leagueSeasonsDB,
                    TABLES.footballLeagueSeasons.name,
                    true
                );
                console.log(
                    `Insert result: ${insertResult} for tournament: ${tournament.id} ${tournament.name}`
                );
                if (insertResult) greenTournaments.push(tournament);
                else throw `!insertResult`;
            } catch (e) {
                // console.log(
                //     `%cFailed to get data for tournament: ${tournament.id} ${tournament.name}`,
                //     'color: orange'
                // );
                dudTournaments.push(tournament);
            }
        }

        console.warn(
            `#dudTournaments: ${dudTournaments.length}\n\n${dudTournaments
                .map((dud) => dud.name + ' ' + dud.id)
                .join('\n')}`
        );
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

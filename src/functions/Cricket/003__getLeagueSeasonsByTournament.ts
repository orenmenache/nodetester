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

type LeagueType = 'T20' | 'ODI' | 'TEST' | 'Unknown';

/**
 * CORE__TOURNAMENTS must be populated first
 * or run getTournamentsByCategory
 */
export async function getLeagueSeasonsByTournament__CRICKET(DB: MYSQL_DB) {
    const funcName = `getLeagueSeasonsByTournament__CRICKET`;
    try {
        //await DB.cleanTable(TABLES.cricketLeagueSeasons);

        const tournaments: DB__Tournament[] = await DB.SELECT<DB__Tournament>(
            TABLES.cricketTournaments.name
        );

        for (const tournament of tournaments) {
            try {
                const url = allSportsAPIURLs.CRICKET.leagueseasons.replace(
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

                const leagueSeasonsDB: DB__LeagueSeason[] = leagueSeasons.map(
                    (leagueSeason: AllSports__LeagueSeason) => {
                        let type: LeagueType = 'Unknown';
                        if (leagueSeason.name.indexOf('T20') > -1) type = 'T20';
                        if (leagueSeason.name.indexOf('ODI') > -1) type = 'ODI';
                        if (
                            leagueSeason.name.toLowerCase().indexOf('test') > -1
                        )
                            type = 'TEST';

                        return {
                            id: leagueSeason.id,
                            name: leagueSeason.name,
                            editor: leagueSeason.editor,
                            year: leagueSeason.year,
                            tournament_id: tournament.id,
                            hasLastMatches: false, // will be updated in getLastMatches
                            hasNextMatches: false, // will be updated in getNextMatches
                            type,
                            women:
                                leagueSeason.name
                                    .toLowerCase()
                                    .indexOf('women') > -1,
                        };
                    }
                );

                const insertResult = await DB.INSERT_BATCH<DB__LeagueSeason>(
                    leagueSeasonsDB,
                    TABLES.cricketLeagueSeasons.name,
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
        return true;
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

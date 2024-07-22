import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB__LeagueSeason } from '../../types/allSportsApi/Seasons';
import { ASA } from '../../types/namespaces/ASA';
import { DB } from '../../types/namespaces/DB';
import * as dotenv from 'dotenv';
import { DB__Tournament } from '../../types/allSportsApi/UniqueTournaments';
dotenv.config();

type LeagueType = 'T20' | 'ODI' | 'TEST' | 'Unknown';

/**
 * CORE__TOURNAMENTS must be populated first
 * or run getTournamentsByCategory
 */
export async function getLeagueSeasonsByTournament__CRICKET(DB: MYSQL_DB) {
    const funcName = `getLeagueSeasonsByTournament__CRICKET`;
    try {
        // await DB.cleanTable(TABLES.cricketLeagueSeasons.name);

        const now = new Date();
        const thisYear = now.getFullYear();
        const thisShortYear = Number(thisYear.toString().slice(2));

        let dudTournaments: DB.Tournament[] = [];
        let greenTournaments: DB.Tournament[] = [];

        const tournaments: DB.Tournament[] = await DB.SELECT<DB.Tournament>(
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
                    seasons: ASA.LeagueSeason[];
                }> = await axios.request(axiosRequest);

                const leagueSeasons: ASA.LeagueSeason[] = response.data.seasons;

                if (leagueSeasons.length === 0 || !leagueSeasons) {
                    throw `No seasons for tournament: ${tournament.id} ${tournament.name}`;
                }

                const filtered = leagueSeasons.filter(
                    (season: ASA.LeagueSeason) =>
                        Number(season.year) >= thisYear ||
                        season.year.includes(String(thisShortYear)) ||
                        season.year.includes(String(thisShortYear + 1))
                );

                console.warn(`filtered length: ${filtered.length}`);

                if (filtered.length === 0) {
                    throw `No leagues THIS YEAR or NEXT YEAR for tournament: ${JSON.stringify(
                        tournament
                    )}`;
                }

                const leagueSeasonsDB: DB.LeagueSeason[] = filtered.map(
                    (leagueSeason: ASA.LeagueSeason) => {
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
                            year: leagueSeason.year,
                            tournament_id: tournament.id,
                            has_last_matches: false, // will be updated in getLastMatches
                            has_next_matches: false, // will be updated in getNextMatches
                            has_standings: false, // will be updated in getStandings
                            has_last_matches_within_last_month: false, // will be updated in getLastMatchesWithinLastMonth
                            type,
                        };
                    }
                );

                const insertResult = await DB.INSERT_BATCH_OVERWRITE(
                    leagueSeasonsDB,
                    TABLES.cricketLeagueSeasons.name
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
                dudTournaments.push(tournament as DB__Tournament);
            }
        }
        return true;
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

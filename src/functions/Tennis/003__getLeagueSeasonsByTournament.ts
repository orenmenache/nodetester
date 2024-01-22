import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB__LeagueSeason } from '../../types/allSportsApi/Seasons';
import { ASA } from '../../types/namespaces/ASA';
import { DB } from '../../types/namespaces/DB';
import * as dotenv from 'dotenv';
dotenv.config();

export async function getLeagueSeasonsByTournament__TENNIS(DB: MYSQL_DB) {
    const funcName = `getLeagueSeasonsByTournament__TENNIS`;
    try {
        await DB.cleanTable(TABLES.tennisLeagueSeasons.name);

        const tournaments: DB.Tournament[] = await DB.SELECT<DB.Tournament>(
            TABLES.tennisTournaments.name
        );

        for (const tournament of tournaments) {
            try {
                const url = allSportsAPIURLs.TENNIS.leagueseasons.replace(
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
                    console.log(
                        `%cNo seasons for tournament: ${tournament.id} ${tournament.name}`,
                        'color: yellow'
                    );
                    continue;
                }

                const currentlyActiveSeasons: ASA.LeagueSeason[] =
                    leagueSeasons.filter((leagueSeason: ASA.LeagueSeason) =>
                        leagueSeason.year.toString().includes('24')
                    );

                if (
                    currentlyActiveSeasons.length === 0 ||
                    !currentlyActiveSeasons
                ) {
                    console.log(
                        `%cNo currentlyActiveSeasons for tournament: ${tournament.id} ${tournament.name}`,
                        'color: orange'
                    );
                    continue;
                }

                const leagueSeasonsDB: DB.LeagueSeason[] =
                    currentlyActiveSeasons.map(
                        (leagueSeason: ASA.LeagueSeason) => {
                            return {
                                id: leagueSeason.id,
                                name: leagueSeason.name,
                                year: leagueSeason.year,
                                tournament_id: tournament.id,
                                has_last_matches: false, // will be updated in getLastMatches
                                has_next_matches: false, // will be updated in getNextMatches
                                has_standings: false, // will be updated in getStandings
                                has_last_matches_within_last_month: false, // will be updated in getLastMatchesWithinLastMonth
                            };
                        }
                    );

                const insertResult = await DB.INSERT_BATCH<DB.LeagueSeason>(
                    leagueSeasonsDB,
                    TABLES.tennisLeagueSeasons.name,
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

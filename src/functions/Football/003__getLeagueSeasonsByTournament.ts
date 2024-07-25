import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { ASA } from '../../types/namespaces/ASA';
import { DB } from '../../types/namespaces/DB';
dotenv.config();

export async function getLeagueSeasonsByTournament__FOOTBALL(DB: MYSQL_DB) {
    const funcName = `getLeagueSeasonsByTournament__FOOTBALL`;
    try {
        // await DB.cleanTable(TABLES.footballLeagueSeasons.name);

        const now = new Date();
        const thisYear = now.getFullYear();
        const thisShortYear = Number(thisYear.toString().slice(2));

        let dudTournaments: DB.Tournament[] = [];
        let greenTournaments: DB.Tournament[] = [];

        const tournaments: DB.Tournament[] = await DB.SELECT<DB.Tournament>(
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

                const filtered = leagueSeasons.filter(
                    (season: ASA.LeagueSeason) =>
                        Number(season.year) >= thisYear ||
                        season.year.includes(String(thisShortYear)) ||
                        season.year.includes(String(thisShortYear + 1))
                );

                if (filtered.length === 0) {
                    throw `No leagues THIS YEAR or NEXT YEAR for tournament: ${JSON.stringify(
                        tournament
                    )}`;
                }

                const leagueSeasonsDB: DB.LeagueSeason[] = filtered.map(
                    //const leagueSeasonsDB: DB__LeagueSeason[] = leagueSeasons.map(
                    (leagueSeason: ASA.LeagueSeason) => ({
                        id: leagueSeason.id,
                        name: leagueSeason.name,
                        year: leagueSeason.year,
                        tournament_id: tournament.id,
                        has_last_matches: false,
                        has_next_matches: false,
                        has_standings: false,
                        has_last_matches_within_last_month: false,
                    })
                );

                const insertResult = await DB.INSERT_BATCH_OVERWRITE(
                    leagueSeasonsDB,
                    TABLES.footballLeagueSeasons.name
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
        return true;
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

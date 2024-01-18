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
import { ASA } from '../../types/namespaces/ASA';
import { DB } from '../../types/namespaces/DB';
dotenv.config();

/**
 * Builds on categories
 * Tested 201123
 */
export async function getLeagueSeasonsByTournament__TENNIS(DB: MYSQL_DB) {
    const funcName = `getLeagueSeasonsByTournament__TENNIS`;
    try {
        await DB.cleanTable(TABLES.tennisLeagueSeasons.name);

        const now = new Date();
        const thisYear = now.getFullYear();
        let dudTournaments: DB__Tournament[] = [];
        let greenTournaments: DB__Tournament[] = [];

        const tournaments: DB__Tournament[] = await DB.SELECT<DB__Tournament>(
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
                    throw `No seasons for tournament: ${tournament.id} ${tournament.name}`;
                }

                const filtered = leagueSeasons.filter(
                    (season: ASA.LeagueSeason) =>
                        Number(season.year) >= thisYear ||
                        season.year === '23/24'
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

                const insertResult = await DB.INSERT_BATCH<DB.LeagueSeason>(
                    leagueSeasonsDB,
                    TABLES.tennisLeagueSeasons.name,
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

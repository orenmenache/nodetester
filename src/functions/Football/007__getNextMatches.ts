import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB__LeagueSeason } from '../../types/allSportsApi/Seasons';
import { TABLE_NAMES } from '../../config/NAMES';
import { formatDateToSQLTimestamp } from '../formatToMySQLTimestamp';
import {
    AllSports__NextMatch,
    DB__NextMatch,
} from '../../types/allSportsApi/Match/NextMatch';

export async function getNextMatches__FOOTBALL() {
    const funcName = `getNextMatches__FOOTBALL`;
    const DB = new MYSQL_DB();
    DB.createPool();
    try {
        const EnglishPremierLeague: DB__LeagueSeason = {
            id: '52186',
            name: 'Premier League 23/24',
            editor: false,
            year: '23/24',
            tournament_id: '17',
        };

        const ls = EnglishPremierLeague;

        await DB.cleanTable(TABLE_NAMES.footballNextMatches);
        const url = allSportsAPIURLs.FOOTBALL.nextMatches
            .replace('tournamentId', ls.tournament_id.toString())
            .replace('seasonId', ls.id.toString());

        const headers = {
            'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
            'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
        };

        const axiosRequest = {
            method: 'GET',
            url,
            headers,
        };

        const response: AxiosResponse<{ events: AllSports__NextMatch[] }> =
            await axios.request(axiosRequest);

        //console.log(response.data.events.length);

        let nextMatches: DB__NextMatch[] = [];

        for (const event of response.data.events) {
            const dbNextMatch: DB__NextMatch = {
                tournament_id: event.tournament.uniqueTournament.id,
                round: event.roundInfo.round,
                homeTeamId: event.homeTeam.id,
                awayTeamId: event.awayTeam.id,
                id: event.id,
                startTimestamp: formatDateToSQLTimestamp(
                    new Date(Number(event.startTimestamp) * 1000)
                ),
                slug: event.slug,
            };
            nextMatches.push(dbNextMatch);
        }

        const insertResult = await DB.INSERT_BATCH<DB__NextMatch>(
            nextMatches,
            TABLE_NAMES.footballNextMatches,
            true
        );

        console.log(`Insert result: ${insertResult}`);
    } catch (e) {
        throw `Error in ${funcName}: ${e}`;
    } finally {
        await DB.pool.end();
    }
}

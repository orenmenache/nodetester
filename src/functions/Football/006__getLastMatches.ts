import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB__LeagueSeason } from '../../types/allSportsApi/Seasons';
import {
    AllSports__LastMatch,
    DB__LastMatch,
} from '../../types/allSportsApi/Match/LastMatch';
import { TABLES } from '../../config/NAMES';
import { formatDateToSQLTimestamp } from '../formatToMySQLTimestamp';

export async function getLastMatches__FOOTBALL(DB: MYSQL_DB) {
    const funcName = `getLastMatches__FOOTBALL`;
    try {
        const EnglishPremierLeague: DB__LeagueSeason = {
            id: '52186',
            name: 'Premier League 23/24',
            editor: false,
            year: '23/24',
            tournament_id: '17',
            hasLastMatches: true,
            hasNextMatches: true,
            woman: false,
        };

        const ls = EnglishPremierLeague;

        await DB.cleanTable(TABLES.footballLastMatches.name);
        const url = allSportsAPIURLs.FOOTBALL.lastMatches
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

        const response: AxiosResponse<{ events: AllSports__LastMatch[] }> =
            await axios.request(axiosRequest);

        //console.log(response.data.events.length);

        let lastMatches: DB__LastMatch[] = [];

        for (const event of response.data.events) {
            const dbLastMatch: DB__LastMatch = {
                tournament_id: event.tournament.uniqueTournament.id,
                round: event.roundInfo.round,
                winnerCode: event.winnerCode,
                homeTeamId: event.homeTeam.id,
                awayTeamId: event.awayTeam.id,
                homeScore: event.homeScore.current,
                awayScore: event.awayScore.current,
                id: event.id,
                startTimestamp: formatDateToSQLTimestamp(
                    new Date(Number(event.startTimestamp) * 1000)
                ),
                slug: event.slug,
            };
            lastMatches.push(dbLastMatch);
        }

        const insertResult = await DB.INSERT_BATCH<DB__LastMatch>(
            lastMatches,
            TABLES.footballLastMatches.name,
            true
        );

        console.log(`Insert result: ${insertResult}`);
    } catch (e) {
        throw `Error in ${funcName}: ${e}`;
    }
}

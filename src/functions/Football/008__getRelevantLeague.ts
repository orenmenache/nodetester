/**
 * Here we're gonna assume that user selected the tournament
 */

import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB } from '../../types/namespaces/DB';
import * as dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { ASA } from '../../types/namespaces/ASA';
import { formatDateToSQLTimestamp } from '../GEN/formatToMySQLTimestamp';
dotenv.config();

export async function getRelevantLeagueSeason(tournament: DB.Tournament) {
    const FootballDB = new MYSQL_DB('Football');
    FootballDB.createPool();

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

        if (response.data.seasons.length === 0 || !response.data.seasons) {
            throw `No seasons for tournament: ${tournament.id} ${tournament.name}`;
        }

        const leagueSeasons: DB.LeagueSeason[] = response.data.seasons.map(
            (ls: ASA.LeagueSeason) => {
                return {
                    id: ls.id,
                    name: ls.name,
                    year: ls.year,
                    tournament_id: tournament.id,
                    has_next_matches: false, // will be updated in getNextMatches
                    has_last_matches: false, // will be updated in getLastMatches
                    has_standings: false, // will be updated in getStandings
                    has_last_matches_within_last_month: false, // will be updated in getLastMatches
                };
            }
        );

        console.log(`leagueSeasons: ${leagueSeasons.length}`);
        console.log(`Now checking which has next matches`);

        const nextMatches = await getNextMatches(leagueSeasons[0]);
    } catch (e) {
        throw `getRelevantLeagueSeason: ${e}`;
    } finally {
        await FootballDB.pool.end();
    }
}

async function getNextMatches(
    leagueSeason: DB.LeagueSeason
): Promise<DB.Football.NextMatch[]> {
    const url = allSportsAPIURLs.FOOTBALL.nextMatches
        .replace('tournamentId', leagueSeason.tournament_id.toString())
        .replace('seasonId', leagueSeason.id.toString());

    const headers = {
        'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
        'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
    };

    const axiosRequest = {
        method: 'GET',
        url,
        headers,
    };

    const response: AxiosResponse<{ events: ASA.Football.NextMatch[] }> =
        await axios.request(axiosRequest);

    let nextMatches: DB.Football.NextMatch[] = [];

    for (const event of response.data.events) {
        const dbNextMatch: DB.Football.NextMatch = {
            tournament_id: event.tournament.uniqueTournament.id,
            //round: event.roundInfo.round,
            homeTeamId: event.homeTeam.id,
            awayTeamId: event.awayTeam.id,
            homeTeamName: event.homeTeam.name,
            awayTeamName: event.awayTeam.name,
            id: event.id,
            startTimestamp: formatDateToSQLTimestamp(
                new Date(Number(event.startTimestamp) * 1000)
            ),
            slug: event.slug,
        };
        nextMatches.push(dbNextMatch);
    }
}

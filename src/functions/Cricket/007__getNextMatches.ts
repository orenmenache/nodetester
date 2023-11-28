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
import * as dotenv from 'dotenv';
dotenv.config();

export async function getNextMatches__CRICKET(DB: MYSQL_DB) {
    const funcName = `getNextMatches__CRICKET`;
    try {
        const headers = {
            'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
            'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
        };

        await DB.cleanTable(TABLE_NAMES.cricketNextMatches);

        const leageSeasons: DB__LeagueSeason[] =
            await DB.SELECT<DB__LeagueSeason>(TABLE_NAMES.cricketLeagueSeasons);

        for (const ls of leageSeasons) {
            try {
                const url = allSportsAPIURLs.CRICKET.nextMatches
                    .replace('tournamentId', ls.tournament_id.toString())
                    .replace('seasonId', ls.id.toString());

                const axiosRequest = {
                    method: 'GET',
                    url,
                    headers,
                };

                const response: AxiosResponse<{
                    events: AllSports__NextMatch[];
                }> = await axios.request(axiosRequest);

                if (!response.data.events) throw 'No events in response';

                let nextMatches: DB__NextMatch[] = [];
                //console.log(response.data.events.length);

                console.log(
                    `%cevent.length: ${response.data.events.length} leagueSeason: ${ls.id} ${ls.name} ${ls.year}`,
                    'color: green'
                );

                for (const event of response.data.events) {
                    const dbNextMatch: DB__NextMatch = {
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

                const insertResult = await DB.INSERT_BATCH<DB__NextMatch>(
                    nextMatches,
                    TABLE_NAMES.cricketNextMatches,
                    true
                );

                console.log(`Insert result: ${insertResult}`);

                // now let's update the leagueSeasons table
                const updateResult = await DB.UPDATE(
                    TABLE_NAMES.cricketLeagueSeasons,
                    { active: 1 },
                    { id: ls.id }
                );

                console.log(
                    `Update result: ${updateResult} for ${ls.id} ${ls.name}`
                );
            } catch (e) {
                console.warn(`${e}`);
            }
        }
    } catch (e) {
        throw `Error in ${funcName}: ${e}`;
    }
}

/*
        // const AustraliaIndiaLeague: DB__LeagueSeason = {
        //     id: '53423',
        //     name: 'something',
        //     editor: false,
        //     year: 'doesntmatter',
        //     tournament_id: '11191',
        // };

        // const AUURL = allSportsAPIURLs.CRICKET.nextMatches
        //     .replace(
        //         'tournamentId',
        //         AustraliaIndiaLeague.tournament_id.toString()
        //     )
        //     .replace('seasonId', AustraliaIndiaLeague.id.toString());

        // const axiosRequest = {
        //     method: 'GET',
        //     url: AUURL,
        //     headers,
        // };

        // const response = await axios.request(axiosRequest);

        
        // // console.log(response.data.events.length);

        // // const firstEvent = response.data.events[0];

        // // for (let n in firstEvent) {
        // //     console.log(n);
        // // }

        // for (const event of response.data.events) {
        //     const dbNextMatch: DB__NextMatch = {
        //         tournament_id: event.tournament.uniqueTournament.id,
        //         //round: event.roundInfo.round,
        //         homeTeamId: event.homeTeam.id,
        //         awayTeamId: event.awayTeam.id,
        //         homeTeamName: event.homeTeam.name,
        //         awayTeamName: event.awayTeam.name,
        //         id: event.id,
        //         startTimestamp: formatDateToSQLTimestamp(
        //             new Date(Number(event.startTimestamp) * 1000)
        //         ),
        //         slug: event.slug,
        //     };
        //     nextMatches.push(dbNextMatch);
        // }

        // const insertResult = await DB.INSERT_BATCH<DB__NextMatch>(
        //     nextMatches,
        //     TABLE_NAMES.cricketNextMatches,
        //     true
        // );

        // console.log(`Insert result: ${insertResult}`);
        */

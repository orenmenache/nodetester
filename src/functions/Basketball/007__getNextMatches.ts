import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB__LeagueSeason } from '../../types/allSportsApi/Seasons';
import { TABLES } from '../../config/NAMES';
import { formatDateToSQLTimestamp } from '../GEN/formatToMySQLTimestamp';
import {
    AllSports__NextMatch,
    DB__NextMatch,
} from '../../types/allSportsApi/Match/NextMatch';
import { DB } from '../../types/namespaces/DB';
import { ASA } from '../../types/namespaces/ASA';
import { BASKETBALL } from '../../config/tables/BASKETBALL';

export async function getNextMatches__BASKETBALL(DB: MYSQL_DB) {
    const funcName = `getNextMatches__BASKETBALL`;

    try {
        const leagueSeasons: DB.LeagueSeason[] =
            await DB.SELECT<DB.LeagueSeason>(BASKETBALL.leagueSeasons);

        // await DB.cleanTable(TABLES.basketballNextMatches.name);
        // return;
        for (const ls of leagueSeasons) {
            // let's sleep for 1 second between iterations
            await new Promise((resolve) => setTimeout(resolve, 1000));
            //const ls = leagueSeasons[i];

            //for (const ls of leagueSeasons) {
            // if (ls.name.toLowerCase().includes('women')) {
            //     const sql = `DELETE FROM ${TABLES.basketballLeagueSeasons.name} WHERE id = ${ls.id}`;
            //     await DB.pool.execute(sql);
            //     console.log(`Deleted leagueSeason ${ls.name}`);
            // }

            const url = allSportsAPIURLs.BASKETBALL.nextMatches
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

            const response: AxiosResponse<{
                events: ASA.Football.NextMatch[];
            }> = await axios.request(axiosRequest);

            let nextMatches: DB.Football.NextMatch[] = [];

            if (
                !response.data ||
                !response.data.events ||
                response.data.events.length === 0
            ) {
                console.warn(`No next matches for leagueSeason ${ls.name}`);
                // let's update the leagueSeason to say that it has no next matches
                await DB.UPDATE(
                    BASKETBALL.leagueSeasons,
                    { has_next_matches: false },
                    { id: ls.id }
                );
                continue;
            }

            for (const event of response.data.events) {
                const dbNextMatch: DB.Football.NextMatch = {
                    tournament_id: event.tournament.uniqueTournament.id,
                    league_season_id: ls.id,
                    home_team_id: event.homeTeam.id,
                    away_team_id: event.awayTeam.id,
                    id: event.id,
                    start_time_timestamp: formatDateToSQLTimestamp(
                        new Date(Number(event.startTimestamp) * 1000)
                    ),
                    start_time_seconds: event.startTimestamp,
                    slug: event.slug,
                };
                if (event.homeTeam && event.awayTeam) {
                    const homeTeam: DB.Team = {
                        id: event.homeTeam.id,
                        name: event.homeTeam.name,
                        slug: event.homeTeam.slug,
                        short_name: event.homeTeam.shortName,
                        name_code: event.homeTeam.nameCode,
                    };

                    const awayTeam: DB.Team = {
                        id: event.awayTeam.id,
                        name: event.awayTeam.name,
                        slug: event.awayTeam.slug,
                        short_name: event.awayTeam.shortName,
                        name_code: event.awayTeam.nameCode,
                    };

                    const homeTeamExists = await DB.SELECT<DB.Team>(
                        BASKETBALL.teams,
                        { id: homeTeam.id }
                    );

                    const awayTeamExists = await DB.SELECT<DB.Team>(
                        BASKETBALL.teams,
                        { id: awayTeam.id }
                    );

                    if (homeTeamExists.length === 0) {
                        console.log(
                            `%cInserting hometeam ${homeTeam.name}`,
                            'color: yellow'
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                        await DB.INSERT_BATCH<DB.Team>(
                            [homeTeam],
                            BASKETBALL.teams,
                            false
                        );
                    }

                    if (awayTeamExists.length === 0) {
                        console.log(
                            `%cInserting awayteam ${awayTeam.name}`,
                            'color: yellow'
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                        await DB.INSERT_BATCH<DB.Team>(
                            [awayTeam],
                            BASKETBALL.teams,
                            false
                        );
                    }
                } else {
                    console.warn(
                        'Failed to insert teams: homeTeam or awayTeam is undefined'
                    );
                }
                nextMatches.push(dbNextMatch);
            }

            const insertResult = await DB.INSERT_BATCH<DB.Football.NextMatch>(
                nextMatches,
                BASKETBALL.nextMatches,
                true
            );

            /**
             * Now let's update the leagueSeason to say that it has next matches
             */
            await DB.UPDATE(
                BASKETBALL.leagueSeasons,
                { has_next_matches: true },
                { id: ls.id }
            );
            console.log(`Updated leagueSeason ${ls.name} to has_next_matches`);

            console.log(`Insert result: ${insertResult}`);
        }
    } catch (e) {
        throw `Error in ${funcName}: ${e}`;
    }
}

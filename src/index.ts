import * as dotenv from 'dotenv';
import { HIT } from './HIT';
import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import { getCategories__TENNIS } from './functions/Tennis/001__getCategories';
import { getTournamentsByCategory__TENNIS } from './functions/Tennis/002__getTournamentsByCategory';
import { getCategories__BASKETBALL } from './functions/Basketball/001__getCategories';
import { get } from 'http';
import { getTournamentsByCategory__BASKETBALL } from './functions/Basketball/002__getTournamentsByCategory';
import { getCategories__MOTORSPORT } from './functions/Motorsport/001__getCategories';
import { getStagesByCategory__MOTORSPORT } from './functions/Motorsport/002__getStagesByCategory';
import { getSeasonsByStage__MOTORSPORT } from './functions/Motorsport/003__getSeasonsByStage';
import { getLeagueSeasonsByTournament__BASKETBALL } from './functions/Basketball/003__getLeagueSeasonsByTournament';
import { getLeagueSeasonsByTournament__TENNIS } from './functions/Tennis/003__getLeagueSeasonsByTournament';
import { getCategories__CRICKET } from './functions/Cricket/001__getCategories';
import { getTournamentsByCategory__CRICKET } from './functions/Cricket/002__getTournamentsByCategory';
import { getLeagueSeasonsByTournament__CRICKET } from './functions/Cricket/003__getLeagueSeasonsByTournament';
import { getLeagueSeasonsByTournament__FOOTBALL } from './functions/Football/003__getLeagueSeasonsByTournament';
import { getNextMatches__FOOTBALL } from './functions/Football/007__getNextMatches';
import { getNextMatches__CRICKET } from './functions/Cricket/007__getNextMatches';
import { getNextMatches__BASKETBALL } from './functions/Basketball/007__getNextMatches';
import { getNextMatches__TENNIS } from './functions/Tennis/007__getNextMatches';
import getStandings__FOOTBALL from './functions/Football/009__getStandings';
import getStandings__CRICKET from './functions/Cricket/009__getStandings';
import getStandings__TENNIS from './functions/Tennis/009__getStandings';
import getStandings__BASKETBALL from './functions/Basketball/009__getStandings';
import { formatDateToSQLTimestamp } from './functions/GEN/formatToMySQLTimestamp';
import { DB } from './types/namespaces/DB';
import { FOOTBALL } from './config/tables/FOOTBALL';
import { buildGetRequest } from './functions/Football/functions/buildGetRequest';
import { allSportsAPIURLs } from './config/allSportsAPIURLs';
import axios from 'axios';
import { ASA } from './types/namespaces/ASA';
import { CRICKET } from './config/tables/CRICKET';
dotenv.config();

async function main() {
    const lambdaName = 'SPFBS4getStandings'; // Sports Football Stage4 getStandings

    const DB = new MYSQL_DB();
    DB.createPool();
    try {
        /**
         * We want all leagueSeasons that weren't
         * updated in the last @hourGap hours
         */
        const now = new Date();
        const nowTimestamp = formatDateToSQLTimestamp(now);

        const getLeagueSeasons = async (): Promise<DB.LeagueSeason[]> => {
            const hourGap = new Date(now.getTime() - 4 * 60 * 60 * 1000);
            const targetDateTimeStamp = formatDateToSQLTimestamp(hourGap);
            const customSelect = `
            SELECT * FROM ${FOOTBALL.leagueSeasons} 
            WHERE last_standings_update < '${targetDateTimeStamp}' OR last_standings_update IS NULL;
        `;

            const leagueSeasonsResult = await DB.pool.execute(customSelect);
            if (
                Array.isArray(leagueSeasonsResult) &&
                leagueSeasonsResult.length > 0 &&
                Array.isArray(leagueSeasonsResult[0])
            ) {
                console.log(`leagueSeasons: ${leagueSeasonsResult[0].length}`);
            } else {
                throw `leagueSeasons is not an array`;
            }

            const leagueSeasons = leagueSeasonsResult[0] as DB.LeagueSeason[];
            return leagueSeasons;
        };
        const leagueSeasons = await getLeagueSeasons();

        // select all leagueSeasons
        const allLeagueSeasons = await DB.SELECT<DB.LeagueSeason>(
            FOOTBALL.leagueSeasons
        );

        if (leagueSeasons.length === allLeagueSeasons.length) {
            console.log(`This is a fresh start. So we delete all standings`);
            await DB.cleanTable(FOOTBALL.standings);
        }

        if (leagueSeasons.length === 0) {
            console.log(`No leagueSeasons to update @ ${nowTimestamp}`);
            return true;
        }

        //const ls = leagueSeasons[0];
        for (const ls of leagueSeasons) {
            const axiosRequest = buildGetRequest(
                allSportsAPIURLs.FOOTBALL.standings,
                {
                    tournamentId: ls.tournament_id.toString(),
                    seasonId: ls.id.toString(),
                }
            );

            const response: ASA.Football.Responses.Standings =
                await axios.request(axiosRequest);

            // console.log(JSON.stringify(response.data.standings[0], null, 4));

            if (
                !response.data ||
                typeof response.data !== 'object' ||
                !('standings' in response.data) ||
                response.data.standings.length === 0 ||
                !('rows' in response.data.standings[0])
            ) {
                // error in data
                console.warn(`No standings for leagueSeason ${ls.name}`);
                // let's update the leagueSeason to say that it has no standings
                await DB.UPDATE(
                    FOOTBALL.leagueSeasons,
                    {
                        has_standings: false,
                        last_standings_update: nowTimestamp,
                    },
                    { id: ls.id }
                );
                continue;
            } else {
                // insert standings
                let standingsDB: DB.Football.Standings[] = [];
                const when_created = formatDateToSQLTimestamp(new Date());

                for (const row of response.data.standings[0].rows) {
                    const standings: DB.Football.Standings = {
                        id: row.id.toString(),
                        tournament_id: ls.tournament_id.toString(),
                        league_season_id: ls.id.toString(),
                        team_id: row.team.id.toString(),
                        position: row.position.toString(),
                        matches: row.matches.toString(),
                        wins: row.wins.toString(),
                        losses: row.losses.toString(),
                        points: row.points.toString(),
                        scores_for: row.scoresFor.toString(),
                        scores_against: row.scoresAgainst.toString(),
                        draws: row.draws.toString(),
                        when_created,
                    };
                    standingsDB.push(standings);

                    const TeamExists = await DB.SELECT<DB.Team>(
                        FOOTBALL.teams,
                        {
                            id: row.team.id,
                        }
                    );
                    // console.warn(`TeamExists: ${TeamExists.length}`);

                    // if the team doesn't exist, let's insert it
                    if (TeamExists.length === 0) {
                        console.log(
                            `%cInserting team ${row.team.name}`,
                            'color: yellow'
                        );
                        const team: DB.Team = {
                            id: row.team.id.toString(),
                            name: row.team.name,
                            slug: row.team.slug,
                            short_name: row.team.shortName,
                            name_code: row.team.nameCode,
                        };
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                        const insertTeamResult = await DB.INSERT_BATCH<DB.Team>(
                            [team],
                            FOOTBALL.teams,
                            false
                        );

                        if (!insertTeamResult) throw `false insertTeamsResult`;
                    }
                }

                const insertResult =
                    await DB.INSERT_BATCH<DB.Football.Standings>(
                        standingsDB,
                        FOOTBALL.standings,
                        false
                    );

                if (insertResult) {
                    // update lambda dashbaord
                    await DB.UPDATE(
                        'config.lambdas',
                        {
                            last_run: formatDateToSQLTimestamp(new Date()),
                            last_error: '',
                        },
                        { name: lambdaName }
                    );
                    console.log(
                        `Inserted ${standingsDB.length} standings successfully`
                    );
                }
            } // end else insert standings
        }
        return true;
    } catch (e) {
        const errorMessage = `Error in ${lambdaName}: ${e}`;
        console.log(errorMessage);

        // update lambda dashbaord
        await DB.UPDATE(
            'config.lambdas',
            {
                last_error: `${e}`,
                last_run: formatDateToSQLTimestamp(new Date()),
            },
            { name: lambdaName }
        );
    } finally {
        console.log(`Closing connection`);
        await DB.pool.end();
    }
}

async function testLambda() {
    const lambdaName = 'SPCRS6getLastMatches'; // Sports Cricket Stage6 getLastMatches

    const DB = new MYSQL_DB();
    DB.createPool();
    try {
        /**
         * Firstly we'll remove matches that are over two months old
         */
        const now = new Date();
        const nowTimestamp = formatDateToSQLTimestamp(now);
        const weeksBackwardFactor = 12;
        const hourBackwardFactor = 0;

        const oldLimit = new Date(
            now.getTime() - weeksBackwardFactor * 7 * 24 * 60 * 60 * 1000
        );

        const deleteOldMatches = async (): Promise<void> => {
            const targetDateTimeStamp = formatDateToSQLTimestamp(oldLimit);
            const customSelect = `
                DELETE FROM ${CRICKET.lastMatches} 
                WHERE start_time_timestamp < '${targetDateTimeStamp}';
            `;
            await DB.pool.execute(customSelect);
        };

        await deleteOldMatches();

        const selectLeagueSeasons = async (): Promise<DB.LeagueSeason[]> => {
            // select all leagueSeasons that weren't updated in the last 8 hours
            const backwardDate = new Date(
                now.getTime() - hourBackwardFactor * 60 * 60 * 1000
            );
            const backwardDateTimeStamp =
                formatDateToSQLTimestamp(backwardDate);
            const customSelect = `
                SELECT * FROM ${CRICKET.leagueSeasons}
                WHERE last_lastmatches_update IS NULL OR last_lastmatches_update < '${backwardDateTimeStamp}';
            `;
            const result = await DB.pool.execute(customSelect);
            const [rows] = result;
            return rows as DB.LeagueSeason[];
        };

        const leagueSeasons = await selectLeagueSeasons();

        if (leagueSeasons.length === 0) {
            console.log(`No leagueSeasons @ ${nowTimestamp}`);
            return true;
        }

        //const ls = leagueSeasons[0];
        for (const ls of leagueSeasons) {
            const axiosRequest = buildGetRequest(
                allSportsAPIURLs.CRICKET.lastMatches,
                {
                    tournamentId: ls.tournament_id.toString(),
                    seasonId: ls.id.toString(),
                }
            );

            const response: ASA.Cricket.Responses.LastMatches =
                await axios.request(axiosRequest);

            const keyWord = 'events';

            if (
                !response.data ||
                typeof response.data !== 'object' ||
                !(keyWord in response.data) ||
                response.data[keyWord].length === 0
            ) {
                // error in data
                console.warn(`No ${keyWord} for leagueSeason ${ls.name}`);
                // let's update the leagueSeason to say that it has no last matches
                // and when it was updated
                await DB.UPDATE(
                    CRICKET.leagueSeasons,
                    {
                        has_last_matches: false,
                        last_lastmatches_update: nowTimestamp,
                    },
                    { id: ls.id }
                );
                continue;
            } // else {

            let lastMatches: DB.Cricket.LastMatch[] = [];
            // const when_created = formatDateToSQLTimestamp(new Date());

            // let's filter out the matches that are over 2 months old
            const events = response.data.events.filter(
                (event) =>
                    new Date(Number(event.startTimestamp) * 1000) > oldLimit
            );

            if (events.length === 0) {
                console.warn(
                    `*** After filtering *** No new matches for leagueSeason ${ls.name}`
                );
                // let's update the leagueSeason to say that it has no last matches
                // and when it was updated
                await DB.UPDATE(
                    CRICKET.leagueSeasons,
                    {
                        has_last_matches: false,
                        last_lastmatches_update: nowTimestamp,
                    },
                    { id: ls.id }
                );
                continue;
            }

            // console.log(
            //     `Filtered out ${
            //         response.data.events.length - events.length
            //     } matches out of ${response.data.events.length} total matches`
            // );

            // console.log(
            //     `response.data.events Dates: ${response.data.events.map(
            //         (e) => e.startTimestamp
            //     )}`
            // );
            // console.log(`events Dates: ${events.map((e) => e.startTimestamp)}`);

            // return;

            for (const event of events) {
                const lastMatch: DB.Cricket.LastMatch = {
                    id: event.id.toString(),
                    league_season_id: ls.id,
                    tournament_id: ls.tournament_id,
                    start_time_seconds: String(event.startTimestamp),
                    start_time_timestamp: formatDateToSQLTimestamp(
                        new Date(Number(event.startTimestamp) * 1000)
                    ),
                    home_team_id: event.homeTeam.id.toString(),
                    away_team_id: event.awayTeam.id.toString(),
                    slug: event.slug,
                    winner_code: String(event.winnerCode),
                    home_score: String(event.homeScore.current),
                    away_score: String(event.awayScore.current),
                };

                // console.log(`lastMatch: ${JSON.stringify(lastMatch, null, 4)}`);
                // return;

                const insertMissingTeams = async () => {
                    for (const team of [event.homeTeam, event.awayTeam]) {
                        const TeamExists = await DB.SELECT<DB.Team>(
                            CRICKET.teams,
                            {
                                id: team.id.toString(),
                            }
                        );

                        if (TeamExists.length === 0) {
                            console.log(
                                `%cInserting team ${team.name}`,
                                'color: yellow'
                            );
                            const team__DB: DB.Team = {
                                id: team.id.toString(),
                                name: team.name,
                                slug: team.slug,
                                short_name: team.shortName,
                                name_code: team.nameCode,
                            };

                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            );

                            const insertTeamResult =
                                await DB.INSERT_BATCH_OVERWRITE<DB.Team>(
                                    [team__DB],
                                    CRICKET.teams,
                                    true
                                );

                            if (!insertTeamResult)
                                throw `false insertTeamsResult for team ${
                                    team.name
                                } JSON: ${JSON.stringify(team__DB)}`;
                        }
                    }
                };

                await insertMissingTeams();
                lastMatches.push(lastMatch);
            }

            console.log(`Inserting ${lastMatches.length} lastMatches`);

            const insertLastMatchesResult =
                await DB.INSERT_BATCH_OVERWRITE<DB.Cricket.LastMatch>(
                    lastMatches,
                    CRICKET.lastMatches,
                    true
                );

            if (insertLastMatchesResult) {
                // let's update the leagueSeason to say that it has standings
                // and when it was updated
                await DB.UPDATE(
                    CRICKET.leagueSeasons,
                    {
                        has_last_matches: true,
                        last_lastmatches_update: nowTimestamp,
                    },
                    { id: ls.id }
                );
                // update lambda dashbaord
                await DB.UPDATE(
                    'config.lambdas',
                    {
                        last_run: formatDateToSQLTimestamp(new Date()),
                        last_error: '',
                    },
                    { name: lambdaName }
                );
                console.log(
                    `Inserted ${lastMatches.length} lastMatches successfully`
                );
            }
            //} // end else insert standings
        }
        return true;
    } catch (e) {
        const errorMessage = `Error in ${lambdaName}: ${e}`;
        console.log(errorMessage);

        // update lambda dashbaord
        await DB.UPDATE(
            'config.lambdas',
            {
                last_error: `${e}`,
                last_run: formatDateToSQLTimestamp(new Date()),
            },
            { name: lambdaName }
        );
    } finally {
        console.log(`Closing connection`);
        await DB.pool.end();
    }
}

async function testHit() {
    const hit = await HIT.Cricket.lastMatches();
}

testLambda();
//testHit();
//main();

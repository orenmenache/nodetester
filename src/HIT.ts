import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from './config/allSportsAPIURLs';
import { DB } from './types/namespaces/DB';
import { ASA } from './types/namespaces/ASA';
import { buildGetRequest } from './functions/Football/functions/buildGetRequest';
import { headers } from './config/HEADERS';
import { TopRankingTeam, getTeamIds } from './Ranking';
import { runFunctionWithRetry } from './functions/RunFunctionWithRetry';
import { formatDateToSQLTimestamp } from './functions/GEN/formatToMySQLTimestamp';
import { AMERICANFOOTBALL } from './config/tables/AMERICANFOOTBALL';

export type TeamLastMatch = {
    id: number;
    start_time_seconds: number;
    start_time_timestamp: Date;
    slug: string;
    home_team_id: number;
    away_team_id: number;
    home_team_name: string;
    away_team_name: string;
    winner_code: number; // 0: Draw, 1: Home, 2: Away
    home_score: number;
    away_score: number;
};

/**
 * This file is used to test the API calls
 */
export const HIT = {
    Football: {
        async nextMatches() {
            const FootballDB = new MYSQL_DB('Football');
            FootballDB.createPool();

            const ls: DB.LeagueSeason = {
                id: '52186',
                name: 'Premier League 23/24',
                year: '23/24',
                tournament_id: '17',
                has_next_matches: true,
                has_last_matches: true,
                has_standings: true,
                has_last_matches_within_last_month: true,
            };

            const axiosRequest = buildGetRequest(
                allSportsAPIURLs.FOOTBALL.nextMatches,
                {
                    tournamentId: ls.tournament_id.toString(),
                    seasonId: ls.id.toString(),
                }
            );

            const response: AxiosResponse<{
                events: ASA.Football.NextMatch[];
            }> = await axios.request(axiosRequest);

            //console.log(JSON.stringify(response.data.events[0], null, 4));
            for (const event of response.data.events) {
                console.log(event.awayTeam.name);
                console.log(event.homeTeam.name);
                console.log(new Date(Number(event.startTimestamp) * 1000));
            }
        },

        // async leagueSeasons() {
        //     const FootballDB = new MYSQL_DB('Football');
        //     FootballDB.createPool();

        //     const tournament: DB.Tournament = {
        //         id: '1',
        //         name: 'European Championship',

        //     };

        //     const axiosRequest = buildGetRequest(
        //         allSportsAPIURLs.FOOTBALL.nextMatches,
        //         {
        //             tournamentId: ls.tournament_id.toString(),
        //             seasonId: ls.id.toString(),
        //         }
        //     );

        //     const response: AxiosResponse<{
        //         events: ASA.Football.NextMatch[];
        //     }> = await axios.request(axiosRequest);

        //     console.log(JSON.stringify(response.data.events[0], null, 4));
        // },

        async standings() {
            const FootballDB = new MYSQL_DB('Football');
            FootballDB.createPool();

            const ls: DB.LeagueSeason = {
                id: '52186',
                name: 'Premier League 23/24',
                year: '23/24',
                tournament_id: '17',
                has_next_matches: true,
                has_last_matches: true,
                has_standings: true,
                has_last_matches_within_last_month: true,
            };

            const axiosRequest = buildGetRequest(
                allSportsAPIURLs.FOOTBALL.standings,
                {
                    tournamentId: ls.tournament_id.toString(),
                    seasonId: ls.id.toString(),
                }
            );

            const response: ASA.Football.Responses.Standings =
                await axios.request(axiosRequest);

            console.log(JSON.stringify(response.data.standings[0], null, 4));
        },

        async playerStatistics() {
            const FootballDB = new MYSQL_DB('Football');
            FootballDB.createPool();

            const ls: DB.LeagueSeason = {
                id: '52186',
                name: 'Premier League 23/24',
                year: '23/24',
                tournament_id: '17',
                has_next_matches: true,
                has_last_matches: true,
                has_standings: true,
                has_last_matches_within_last_month: true,
            };
            const params = {
                limit: '20',
                page: '1',
                group: 'summary',
                order: '-rating',
                accumulation: 'total',
                minApps: 'false',
            };

            const options = {
                method: 'GET',
                url: 'https://allsportsapi2.p.rapidapi.com/api/tournament/17/season/52186/statistics',
                params,
                headers,
            };

            const axiosRequest = buildGetRequest(
                allSportsAPIURLs.FOOTBALL.statistics,
                {
                    tournamentId: ls.tournament_id.toString(),
                    seasonId: ls.id.toString(),
                }
            );

            const response = await axios.request(options);

            console.log(JSON.stringify(response.data, null, 4));
            // for (const cell of response.data.results) {
            //     console.log(JSON.stringify(cell));
            //     return;
            //     // const player = cell.player;
            //     // const team = cell.team;
            //     // console.log(
            //     //     `${player.name} ${team.name} ${cell.rating} ${cell.goals}`
            //     // );
            // }
        },
    },
    Tennis: {
        async categories() {
            const TennisDB = new MYSQL_DB('Tennis');
            TennisDB.createPool();

            const axiosRequest = buildGetRequest(
                allSportsAPIURLs.TENNIS.categories,
                {}
            );

            try {
                const response: AxiosResponse<{ categories: ASA.Category[] }> =
                    await axios.request(axiosRequest);

                console.log(JSON.stringify(response.data.categories, null, 4));
            } catch (e) {
                console.log(e);
            } finally {
                await TennisDB.pool.end();
            }
        },
    },
    Cricket: {
        async categories() {
            const CricketDB = new MYSQL_DB('Cricket');
            CricketDB.createPool();

            const axiosRequest = buildGetRequest(
                allSportsAPIURLs.CRICKET.categories,
                {}
            );

            try {
                const response: AxiosResponse<{ categories: ASA.Category[] }> =
                    await axios.request(axiosRequest);

                console.log(JSON.stringify(response.data.categories, null, 4));
            } catch (e) {
                console.log(e);
            } finally {
                await CricketDB.pool.end();
            }
        },
        async lastMatches() {
            const CricketDB = new MYSQL_DB('Cricket');
            CricketDB.createPool();

            const ls: DB.LeagueSeason = {
                id: '44608',
                name: 'Dunno',
                year: `Don't matter`,
                tournament_id: '19048',
                has_next_matches: true,
                has_last_matches: true,
                has_standings: true,
                has_last_matches_within_last_month: true,
            };

            const axiosRequest: AxiosRequestConfig<any> = buildGetRequest(
                allSportsAPIURLs.CRICKET.lastMatches,
                {
                    tournamentId: ls.tournament_id.toString(),
                    seasonId: ls.id.toString(),
                }
            );

            try {
                const response: ASA.Cricket.Responses.LastMatches =
                    await axios.request(axiosRequest);

                // console.log(JSON.stringify(response.data.events, null, 4));

                for (const event of response.data.events) {
                    console.log(event.awayTeam.id);
                    console.log(event.homeTeam.id);
                    console.log(new Date(Number(event.startTimestamp) * 1000));
                    console.log(event.startTimestamp);
                    console.log(event.awayScore.current);
                    console.log(event.homeScore.current);
                }
            } catch (e) {
                console.log(e);
            } finally {
                await CricketDB.pool.end();
            }
        },
        async teamNextMatches() {
            const DB = new MYSQL_DB();
            DB.createPool();
            try {
                const teamIdUpdateResult: boolean = await getTeamIds();
                if (!teamIdUpdateResult) throw `Error in getTeamIds`;

                console.log('Team IDs updated');

                const fn = async () =>
                    await DB.SELECT<TopRankingTeam>(
                        `Cricket.CORE_ICC_TEAM_RANKING`
                    );
                const topTeams: TopRankingTeam[] = await runFunctionWithRetry(
                    fn,
                    5
                );
                // sort so that the latest entries are first
                topTeams.sort((a, b) => {
                    return Number(a.created_at) - Number(b.created_at);
                });

                const topThirtyTeams: TopRankingTeam[] = [
                    ...topTeams
                        .filter((team) => team.gameType === 'odi')
                        .slice(-10),
                    ...topTeams
                        .filter((team) => team.gameType === 'test')
                        .slice(-10),
                    ...topTeams
                        .filter((team) => team.gameType === 't20')
                        .slice(-10),
                ];

                const teamIds: string[] = topThirtyTeams.map(
                    (team) => team.teamId
                );
                const uniqueTeamIds: string[] = [...new Set(teamIds)];

                // for (const team of topThirtyTeams) {
                //     console.log(team.teamName);
                //     console.log(team.teamId);
                // }

                let teamNextMatches: ASA.Cricket.NextMatch[] = [];
                for (const teamId of uniqueTeamIds) {
                    const axiosRequest = buildGetRequest(
                        allSportsAPIURLs.CRICKET.teamNextMatches,
                        {
                            teamId,
                        }
                    );

                    const response: AxiosResponse<{
                        events: ASA.Cricket.NextMatch[];
                    }> = await axios.request(axiosRequest);

                    // console.log(
                    //     `Team ID: ${teamId}. Matches: ${response.data.events.length}`
                    // );

                    teamNextMatches = [
                        ...teamNextMatches,
                        ...response.data.events,
                    ];
                }

                const trimmedObj = teamNextMatches.map((match) => {
                    return {
                        id: match.id,
                        slug: match.slug,
                        away_team_id: match.awayTeam.id,
                        home_team_id: match.homeTeam.id,
                        home_team_name: match.homeTeam.name,
                        away_team_name: match.awayTeam.name,
                        start_time_seconds: match.startTimestamp,
                        start_time_timestamp: formatDateToSQLTimestamp(
                            new Date(match.startTimestamp * 1000)
                        ),
                    };
                });

                await DB.INSERT_BATCH_OVERWRITE(
                    trimmedObj,
                    'Cricket.RAPID__TEAM_NEXTMATCHES'
                );

                return true;
            } catch (e) {
                console.warn(`Error in getTeamIds: ${e}`);
                return false;
            } finally {
                await DB.pool.end();
            }
        },
        async teamLastMatches() {},
    },
    AmericanFootball: {
        /**
         * "id": 1370, USA
         */
        async categories(DB: MYSQL_DB) {
            const url = allSportsAPIURLs.AMERICANFOOTBALL.categories;
            const headers = {
                'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
                'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
            };

            const axiosRequest = {
                method: 'GET',
                url,
                headers,
            };

            const response: AxiosResponse<{ categories: ASA.Category[] }> =
                await axios.request(axiosRequest);
            const categories: ASA.Category[] = response.data.categories;

            console.log(JSON.stringify(categories, null, 4));
        },
        /**
         * "id": 9464, NFL
         */
        async tournaments(DB: MYSQL_DB) {
            const americanFootballCategory = {
                id: 1370,
            };

            const url = `${allSportsAPIURLs.AMERICANFOOTBALL.tournaments}${americanFootballCategory.id}`;
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
                groups: { uniqueTournaments: ASA.Tournament[] }[];
            }> = await axios.request(axiosRequest);

            // console.log(JSON.stringify(response.data.groups, null, 4));
            // return;
            for (const group of response.data.groups) {
                const tournaments: ASA.Tournament[] = group.uniqueTournaments;

                const filteredTournaments: ASA.Tournament[] =
                    tournaments.filter(
                        (tournament: ASA.Tournament) =>
                            !tournament.name.toLowerCase().includes('women')
                    );

                console.log(
                    `Filtered tournaments: ${filteredTournaments.length}`
                );
                console.log(
                    `First tournament: ${JSON.stringify(
                        filteredTournaments[0],
                        null,
                        4
                    )}`
                );

                // const tournamentsDB: DB.Tournament[] =
                //     filteredTournaments.map(
                //         (tournament: ASA.Tournament) => ({
                //             id: tournament.id,
                //             name: tournament.name,
                //             slug: tournament.slug,
                //             category_id: tournament.category.id,
                //         })
                //     );

                // const insertResult = await DB.INSERT_BATCH<DB.Tournament>(
                //     tournamentsDB,
                //     TABLES.cricketTournaments.name,
                //     true
                // );
                // console.log(
                //     `Insert result: ${insertResult} for category: ${category.id} ${category.name}`
                // );
            }
        },
        async leagueSeasons(DB: MYSQL_DB) {
            const NFLTournamentId = '9464';
            const thisYear = new Date().getFullYear();
            const thisShortYear = Number(thisYear.toString().slice(2));

            const url = allSportsAPIURLs.AMERICANFOOTBALL.leagueseasons.replace(
                'tournamentId',
                NFLTournamentId
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
                throw `No seasons for tournament: ${NFLTournamentId} NFL`;
            }

            const filtered: ASA.LeagueSeason[] = leagueSeasons.filter(
                (season: ASA.LeagueSeason) =>
                    Number(season.year) >= thisYear ||
                    season.year.includes(String(thisShortYear)) ||
                    season.year.includes(String(thisShortYear + 1))
            );

            console.warn(`filtered length: ${filtered.length}`);

            if (filtered.length === 0)
                throw `No leagues THIS YEAR or NEXT YEAR for NFL`;

            const leagueSeasonsDB: DB.LeagueSeason[] = filtered.map(
                ({ id, name, year }: ASA.LeagueSeason) => {
                    return {
                        id,
                        name,
                        year,
                        has_last_matches: false,
                        has_last_matches_within_last_month: false,
                        has_next_matches: false,
                        has_standings: false,
                        tournament_id: NFLTournamentId,
                        last_nextmatches_update: null,
                        last_standings_update: null,
                    };
                }
            );

            const { inserted, affected, changed } =
                await DB.INSERT_BATCH_OVERWRITE(
                    leagueSeasonsDB,
                    AMERICANFOOTBALL.leagueSeasons
                );
            console.log(
                `inserted ${inserted} affected ${affected} changed ${changed}`
            );
            // if (insertResult) greenTournaments.push(tournament);
            // else throw `!insertResult`;
        },
    },
};

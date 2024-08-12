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
import { generateAxiosRequest } from './functions/GEN/hitEndpoint';

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
            const NFLPRESEASONTournamentId = '9465';
            const thisYear = new Date().getFullYear();
            const thisShortYear = Number(thisYear.toString().slice(2));

            const url = allSportsAPIURLs.AMERICANFOOTBALL.leagueseasons.replace(
                'tournamentId',
                NFLPRESEASONTournamentId
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
                throw `No seasons for tournament: ${NFLPRESEASONTournamentId} NFL`;
            }

            // for (const season of leagueSeasons) {
            //     console.log(season.name);
            //     console.log(season.year);
            // }

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
                        tournament_id: NFLPRESEASONTournamentId,
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
    categories: {
        async ALL(DB: MYSQL_DB) {
            let sports = await DB.SELECT<DB.Sport>(`config.CORE_L1_sports`);
            const excludePseudoSports = ['General', 'Misc', 'Mixed', 'Soccer'];
            sports = sports.filter(
                (sport) => !excludePseudoSports.includes(sport.name)
            );

            const templateUrl = `https://allsportsapi2.p.rapidapi.com/api/sport/sportName/categories`;

            for (const sport of sports) {
                console.log(
                    `%csport: ${JSON.stringify(sport, null, 4)}`,
                    'color: pink'
                );

                try {
                    const tableName = `${sport.name}.CORE__CATEGORIES`;

                    /**
                     * Endpoint will usually look like this:
                     * https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/categories
                     * but in the case of motorsport it will look like this:
                     * https://allsportsapi2.p.rapidapi.com/api/motorsport/categories
                     */
                    const sportName =
                        sport.name === 'AmericanFootball'
                            ? 'american-football'
                            : sport.name.toLowerCase();

                    let url = '';
                    switch (sportName) {
                        case 'motorsport': {
                            url = `https://allsportsapi2.p.rapidapi.com/api/motorsport/categories`;
                            break;
                        }
                        case 'football': {
                            url = `https://allsportsapi2.p.rapidapi.com/api/tournament/categories`;
                            break;
                        }
                        default: {
                            url = `https://allsportsapi2.p.rapidapi.com/api/${sportName}/tournament/categories`;
                        }
                    }

                    const axiosRequest: AxiosRequestConfig =
                        generateAxiosRequest(url, {}, false);

                    console.log(
                        `axiosRequest: ${JSON.stringify(axiosRequest, null, 4)}`
                    );
                    // return;
                    const response = await axios.request(axiosRequest);
                    if (!response.data) throw `!response.data`;
                    if (!response.data.categories)
                        throw `!response.data.categories`;
                    const categories: ASA.Category[] = response.data.categories;
                    const dbCategories: DB.Category[] = categories.map(
                        (category) => {
                            return {
                                id: category.id,
                                name: category.name,
                                sport_id: String(sport.id),
                                priority: category.priority || '0',
                                slug: category.slug || '',
                                flag: category.flag || '',
                            };
                        }
                    );

                    const { affected } = await DB.INSERT_BATCH_OVERWRITE(
                        dbCategories,
                        tableName
                    );

                    console.log(
                        `%c${sport.name} affected: ${affected}`,
                        'color: green'
                    );
                } catch (e) {
                    console.warn(`Error in ${sport.name}: ${e}`);
                }
            }
        },
    },
    tournaments: {
        async ALL(DB: MYSQL_DB) {
            let sports = await DB.SELECT<DB.Sport>(`config.CORE_L1_sports`);

            // Motorsport has no tournaments
            const excludePseudoSports = [
                'Motorsport',
                'General',
                'Misc',
                'Mixed',
                'Soccer',
            ];
            sports = sports.filter(
                (sport) => !excludePseudoSports.includes(sport.name)
            );
            // const sport = sports.find((sport) => sport.name === 'Tennis');
            // if (!sport) throw `!sport`;

            // const addAFIfDoesntExist = () => {
            //     const AmericanFootballSport: DB.Sport = {
            //         id: '1370',
            //         name: 'AmericanFootball',
            //         short_name: 'AF',
            //         has_schedule: '1',
            //         has_standings: '1',
            //     };
            //     if (!sports.find((sport) => sport.name === 'AmericanFootball'))
            //         sports.unshift(AmericanFootballSport);
            // };

            // addAFIfDoesntExist();

            for (const sport of sports) {
                if (sport.name !== 'AmericanFootball') continue;
                console.log(`%c${sport.name}`, 'color: pink');

                try {
                    const categoryTableName = `${sport.name}.CORE__CATEGORIES`;
                    const tournamentsTableName = `${sport.name}.CORE__TOURNAMENTS`;

                    const categories: DB.Category[] =
                        await DB.SELECT<DB.Category>(categoryTableName);

                    /*
                    https://allsportsapi2.p.rapidapi.com/api/tournament/all/category/785

                    tournaments: `https://allsportsapi2.p.rapidapi.com/api/sportName/tournament/all/category/`, //expects category number at the end
                    tournaments: `https://allsportsapi2.p.rapidapi.com/api/sportName/tournament/all/category/`, //expects category number at the end
                    tournaments: `https://allsportsapi2.p.rapidapi.com/api/sportName/tournament/all/category/`, //expects category number at the end
                    tournaments: `https://allsportsapi2.p.rapidapi.com/api/sportName/tournament/all/category/`,

                    */

                    const sportName =
                        sport.name === 'AmericanFootball'
                            ? 'american-football'
                            : sport.name.toLowerCase();

                    for (const category of categories) {
                        // in Tennis there are negative category IDs
                        if (Number(category.id) < 0) continue;

                        console.log(`%c${category.name}`, 'color: blue');

                        let url = `https://allsportsapi2.p.rapidapi.com/api/${sportName}/tournament/all/category/${category.id}`;
                        // football has no sportName in the URL
                        if (sportName === 'football')
                            url = url.replace('/football', '');

                        const axiosRequest: AxiosRequestConfig =
                            generateAxiosRequest(url, {}, false);

                        // console.log(
                        //     `axiosRequest: ${JSON.stringify(axiosRequest, null, 4)}`
                        // );
                        // return;
                        const response = await axios.request(axiosRequest);
                        if (!response.data) throw `!response.data`;
                        if (!response.data.groups)
                            throw `!response.data.groups`;

                        // if ('activeUniqueTournamentIds' in response.data) {
                        //     console.log(
                        //         `activeUniqueTournamentIds: ${response.data.activeUniqueTournamentIds.length}`
                        //     );
                        // }
                        // continue;
                        const groups = response.data.groups as {
                            uniqueTournaments: ASA.Tournament[];
                        }[];

                        let dbTournaments: DB.Tournament[] = [];

                        for (const group of groups) {
                            const tournaments: ASA.Tournament[] =
                                group.uniqueTournaments;

                            for (const tournament of tournaments) {
                                /**
                                 * Now let's get the start time and end time of the tournament
                                 */
                                let tournamentDetailsUrl = `https://allsportsapi2.p.rapidapi.com/api/${sportName}/tournament/${tournament.id}`;
                                if (sportName === 'football')
                                    tournamentDetailsUrl =
                                        tournamentDetailsUrl.replace(
                                            '/football',
                                            ''
                                        );

                                console.log(
                                    `tournamentDetailsUrl: ${tournamentDetailsUrl}`
                                );
                                const tournamentDetailsRequest =
                                    generateAxiosRequest(
                                        tournamentDetailsUrl,
                                        {},
                                        false
                                    );

                                const tournamentDetailsResponse =
                                    await axios.request(
                                        tournamentDetailsRequest
                                    );

                                if (
                                    !(
                                        'uniqueTournament' in
                                        tournamentDetailsResponse.data
                                    )
                                )
                                    throw `!uniqueTournament`;

                                const times: {
                                    startDateTimestamp: string;
                                    endDateTimestamp: string;
                                } =
                                    tournamentDetailsResponse.data
                                        .uniqueTournament;

                                if (
                                    !times.startDateTimestamp ||
                                    !times.endDateTimestamp ||
                                    !(Number(times.startDateTimestamp) > 0) ||
                                    !(Number(times.endDateTimestamp) > 0)
                                ) {
                                    console.warn(
                                        `No start or end time for tournament: ${tournament.id}`
                                    );
                                    const dbTournament: DB.Tournament = {
                                        id: tournament.id,
                                        name: tournament.name,
                                        slug: tournament.slug || '',
                                        category_id: category.id,
                                        start_date_seconds: null,
                                        end_date_seconds: null,
                                        start_date_timestamp: null,
                                        end_date_timestamp: null,
                                    };

                                    dbTournaments.push(dbTournament);
                                    continue;
                                }

                                const startDateTimestamp =
                                    formatDateToSQLTimestamp(
                                        new Date(
                                            Number(times.startDateTimestamp) *
                                                1000
                                        )
                                    );
                                const endDateTimestamp =
                                    formatDateToSQLTimestamp(
                                        new Date(
                                            Number(times.endDateTimestamp) *
                                                1000
                                        )
                                    );

                                const dbTournament: DB.Tournament = {
                                    id: tournament.id,
                                    name: tournament.name,
                                    slug: tournament.slug || '',
                                    category_id: category.id,
                                    start_date_timestamp: startDateTimestamp,
                                    end_date_timestamp: endDateTimestamp,
                                    start_date_seconds:
                                        times.startDateTimestamp,
                                    end_date_seconds: times.endDateTimestamp,
                                };

                                dbTournaments.push(dbTournament);
                            }
                        }

                        // console.log(`dbTournaments: ${dbTournaments.length}`);
                        // continue;

                        const { affected } = await DB.INSERT_BATCH_OVERWRITE(
                            dbTournaments,
                            tournamentsTableName
                        );

                        console.log(
                            `%c${sport.name} affected: ${affected} for category: ${category.name} sport: ${sportName}`,
                            'color: green'
                        );
                    }
                } catch (e) {
                    console.warn(`Error in ${sport.name}: ${e}`);
                }
            }
        },
    },
    leagueSeasons: {
        async ALL(DB: MYSQL_DB) {
            let sports = await DB.SELECT<DB.Sport>(`config.CORE_L1_sports`);

            // Motorsport has no tournaments
            // const excludePseudoSports = [
            //     'Motorsport',
            //     'General',
            //     'Misc',
            //     'Mixed',
            //     'Soccer',
            // ];
            // sports = sports.filter(
            //     (sport) => !excludePseudoSports.includes(sport.name)
            // );
            const sport = sports.find((sport) => sport.name === 'Cricket');
            if (!sport) throw `!sport`;

            const addAFIfDoesntExist = () => {
                const AmericanFootballSport: DB.Sport = {
                    id: '1370',
                    name: 'AmericanFootball',
                    short_name: 'AF',
                    has_schedule: '1',
                    has_standings: '1',
                };
                if (!sports.find((sport) => sport.name === 'AmericanFootball'))
                    sports.unshift(AmericanFootballSport);
            };

            addAFIfDoesntExist();

            // for (const sport of sports) {
            console.log(`%c${sport.name}`, 'color: pink');

            try {
                const tournamentsTableName = `${sport.name}.CORE__TOURNAMENTS`;
                const leagueSeasonsTableName = `${sport.name}.CORE__LEAGUESEASONS`;

                const tournaments: DB.Tournament[] =
                    await DB.SELECT<DB.Tournament>(tournamentsTableName);

                /*
                    https://allsportsapi2.p.rapidapi.com/api/tournament/all/category/785

                    tournaments: `https://allsportsapi2.p.rapidapi.com/api/sportName/tournament/all/category/`, //expects category number at the end
                    tournaments: `https://allsportsapi2.p.rapidapi.com/api/sportName/tournament/all/category/`, //expects category number at the end
                    tournaments: `https://allsportsapi2.p.rapidapi.com/api/sportName/tournament/all/category/`, //expects category number at the end
                    tournaments: `https://allsportsapi2.p.rapidapi.com/api/sportName/tournament/all/category/`,

                    */

                const sportName =
                    sport.name === 'AmericanFootball'
                        ? 'american-football'
                        : sport.name.toLowerCase();

                const thisYear = new Date().getFullYear();
                const thisShortYear = Number(thisYear.toString().slice(2));

                for (const tournament of tournaments) {
                    try {
                        let url = `https://allsportsapi2.p.rapidapi.com/api/${sportName}/tournament/${tournament.id}/seasons`;

                        // football has no sportName in the URL
                        if (sportName === 'football')
                            url = url.replace('/football', '');

                        const axiosRequest = generateAxiosRequest(
                            url,
                            {},
                            false
                        );
                        // console.log(
                        //     `axiosRequest: ${JSON.stringify(
                        //         axiosRequest,
                        //         null,
                        //         4
                        //     )}`
                        // );
                        // return;

                        const response: AxiosResponse<{
                            seasons: ASA.LeagueSeason[];
                        }> = await axios.request(axiosRequest);

                        const leagueSeasons: ASA.LeagueSeason[] =
                            response.data.seasons;

                        if (leagueSeasons.length === 0 || !leagueSeasons) {
                            console.warn(
                                `No seasons for tournament: ${tournament.id}`
                            );
                            continue;
                        }

                        // for (const season of leagueSeasons) {
                        //     console.log(season.name);
                        //     console.log(season.year);
                        // }

                        const filtered: ASA.LeagueSeason[] =
                            leagueSeasons.filter(
                                (season: ASA.LeagueSeason) =>
                                    Number(season.year) >= thisYear ||
                                    season.year.includes(
                                        String(thisShortYear)
                                    ) ||
                                    season.year.includes(
                                        String(thisShortYear + 1)
                                    )
                            );

                        // console.log(
                        //     `%cfiltered seasons length for sport ${sportName} ${tournament.name}: ${filtered.length}`,
                        //     'color: orange'
                        // );

                        if (filtered.length === 0) {
                            console.log(
                                `%cNo leagues THIS YEAR or NEXT YEAR for ${sportName} ${tournament.name}`,
                                'color: orange'
                            );
                            continue;
                        }

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
                                    tournament_id: tournament.id,
                                    // last_nextmatches_update: null,
                                    // last_standings_update: null,
                                    // last_matches_update: null,
                                };
                            }
                        );

                        const { inserted, affected, changed } =
                            await DB.INSERT_BATCH_OVERWRITE(
                                leagueSeasonsDB,
                                leagueSeasonsTableName
                            );
                        console.log(
                            `affected ${affected} for sport ${sportName} ${tournament.name}`
                        );
                    } catch (e) {
                        console.warn(
                            `A strange error in ${sport.name} ${tournament.name}: ${e}`
                        );
                    }
                }

                // if (insertResult) greenTournaments.push(tournament);
                // else throw `!insertResult`;
            } catch (e) {
                console.warn(`Error in ${sport.name}: ${e}`);
            }
            // }
        },
    },
};

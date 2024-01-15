import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../../config/allSportsAPIURLs';
import { DB } from '../../../types/namespaces/DB';
import { ASA } from '../../../types/namespaces/ASA';
import { buildGetRequest } from './buildGetRequest';
import { headers } from '../../../config/HEADERS';

/**
 * This file is used to test the API calls
 */
export const HIT = {
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

        const response: AxiosResponse<{ events: ASA.Football.NextMatch[] }> =
            await axios.request(axiosRequest);

        console.log(JSON.stringify(response.data.events[0], null, 4));
    },

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

        const response: ASA.Football.StandingsResponse = await axios.request(
            axiosRequest
        );

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
};

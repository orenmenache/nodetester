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
import {
    AllSports__StandingsResponse,
    AllSports__Team,
    AllSports__TeamStandings,
    DB__Team,
} from '../../types/allSportsApi/Teams';
import { DB } from '../../types/namespaces/DB';
dotenv.config();

/**
 * We get the standings for every league
 * and with that we get the ids and info of the teams
 */
export async function getTeamsByTournamentAndSeason__FOOTBALL(DB: MYSQL_DB) {
    const funcName = `getTeamsByTournamentAndSeason__FOOTBALL`;
    try {
        await DB.cleanTable(TABLES.footballTeams.name);

        let leaguesWithStandings = [];

        const leagueSeasons: DB.LeagueSeason[] =
            await DB.SELECT<DB.LeagueSeason>(TABLES.footballLeagueSeasons.name);

        // const EnglishPremierLeague: DB__LeagueSeason = {
        //     id: '52186',
        //     name: 'Premier League 23/24',
        //     editor: false,
        //     year: '23/24',
        //     tournament_id: '17',
        //     hasLastMatches: true,
        //     hasNextMatches: true,
        //     women: false,
        // };

        // const ls = EnglishPremierLeague;
        for (const ls of leagueSeasons) {
        try {
            const url = allSportsAPIURLs.FOOTBALL.standings
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

            const response: AllSports__StandingsResponse = await axios.request(
                axiosRequest
            );

            if (
                !response ||
                !response.data ||
                !response.data.standings ||
                response.data.standings.length === 0
            )
                throw `!response || !response.data || !response.data.standings || response.data.standings.length`;

            const teams: AllSports__Team[] =
                response.data.standings[0].rows.map(
                    (row: AllSports__TeamStandings) => row.team
                );

            if (teams.length === 0 || !teams)
                throw `teams.length === 0 || !teams for leagueSeason: ${ls.id} ${ls.name} ${ls.year}`;

            const dbTeams: DB__Team[] = teams.map((team: AllSports__Team) => ({
                id: team.id,
                name: team.name,
                slug: team.slug,
                shortName: team.shortName,
                userCount: team.userCount,
                type: team.type,
                leagueSeasonId: ls.id,
            }));

            const insertResult = await DB.INSERT_BATCH<DB__Team>(
                dbTeams,
                TABLES.footballTeams.name,
                true
            );
            console.log(`Insert result: ${insertResult}`);
            if (insertResult) {
                console.log(`%c${JSON.stringify(ls)}`, 'color: cyan');
                leaguesWithStandings.push(ls);
            }
        } catch (e) {
            console.log(
                `%cFailed to get data for leagueSeason with error: ${e}: ${ls.id} ${ls.name}`,
                'color: orange'
            );
        }
        // return;
        //}
        console.log(
            `%cNumber of leagues with standings: ${leaguesWithStandings.length}`,
            'color: yellow'
        );
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

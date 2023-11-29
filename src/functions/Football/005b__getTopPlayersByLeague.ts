import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLE_NAMES } from '../../config/NAMES';
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
import {
    AllSports__Player,
    AllSports__TeamPlayersAPIResponse,
    DB__Player,
} from '../../types/allSportsApi/Player';
import {
    AllSports__Statistics,
    AllSports__TopPlayerBundle,
    AllSports__TopPlayerCategories,
    AllSports__TopPlayersAPIResponse,
    DB__Statistics,
} from '../../types/allSportsApi/TopPlayers';
dotenv.config();

export async function getTopPlayersByLeague__FOOTBALL(DB: MYSQL_DB) {
    const funcName = `getTopPlayersByLeague__FOOTBALL`;
    try {
        await DB.cleanTable(TABLE_NAMES.footballStatistics.name);

        let leaguesWithTopPlayers = [];

        const leagueSeasons: DB__LeagueSeason[] =
            await DB.SELECT<DB__LeagueSeason>(
                TABLE_NAMES.footballLeagueSeasons.name
            );

        for (const ls of leagueSeasons) {
            try {
                const url = allSportsAPIURLs.FOOTBALL.topPlayers
                    .replace('tournamentId', ls.tournament_id.toString())
                    .replace('seasonId', ls.id.toString());

                //console.log(url);
                //const url = `https://allsportsapi2.p.rapidapi.com/api/football/tournament/11165/season/41321/top-players`
                const headers = {
                    'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
                    'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
                };

                const axiosRequest = {
                    method: 'GET',
                    url,
                    headers,
                };

                const response: AllSports__TopPlayersAPIResponse =
                    await axios.request(axiosRequest);

                if (!response || !response.data || !response.data.topPlayers)
                    throw `!response || !response.data`;

                console.log(
                    `%cRAW: ${JSON.stringify(response.data.topPlayers)}`,
                    'color: cyan'
                );

                const statisticsRaw = response.data.topPlayers;
                for (let n in statisticsRaw) {
                    const key = n as AllSports__TopPlayerCategories;
                    const bundle: AllSports__TopPlayerBundle[] =
                        statisticsRaw[key];
                    const stats: DB__Statistics[] = bundle.map(
                        (bundle: AllSports__TopPlayerBundle) => ({
                            innings: bundle.statistics.innings,
                            battingInnings: bundle.statistics.battingInnings,
                            battingMatches: bundle.statistics.battingMatches,
                            runsScored: bundle.statistics.runsScored,
                            hundreds: bundle.statistics.hundreds,
                            matches: bundle.statistics.matches,
                            type: bundle.statistics.type,
                            appearances: bundle.statistics.appearances,
                            category: key,
                            playerId: bundle.player.id,
                            teamId: bundle.team.id,
                            leagueSeasonId: ls.id,
                        })
                    );
                    if (stats.length === 0 || !stats)
                        throw `stats.length === 0 || !stats: ${ls.id} ${ls.name}`;

                    const insertResult = await DB.INSERT_BATCH<DB__Statistics>(
                        stats,
                        TABLE_NAMES.footballStatistics.name,
                        false
                    );
                    if (insertResult) leaguesWithTopPlayers.push(ls);
                }
            } catch (e) {
                //console.log (`%cFailed to get data for leagueSeason with error: ${e}: ${ls.id} ${ls.name}`,'color: orange');
            }
        }

        console.log(`leaguesWithTopPlayers: ${leaguesWithTopPlayers.length}`);
        const ids = leaguesWithTopPlayers.map((league) => league.id).join(', ');
        const names = leaguesWithTopPlayers
            .map((league) => league.name)
            .join(', ');
        console.warn(ids, names);
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

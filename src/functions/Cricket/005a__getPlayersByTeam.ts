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
dotenv.config();

export async function getPlayersByTeam__CRICKET(DB: MYSQL_DB) {
    const funcName = `getPlayersByTeam__CRICKET`;
    try {
        await DB.cleanTable(TABLE_NAMES.cricketPlayers);

        const teams: DB__Team[] = await DB.SELECT<DB__Team>(
            TABLE_NAMES.cricketTeams
        );

        for (const team of teams) {
            try {
                const url = allSportsAPIURLs.CRICKET.teamPlayers.replace(
                    'teamId',
                    team.id.toString()
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

                const response: AllSports__TeamPlayersAPIResponse =
                    await axios.request(axiosRequest);

                if (!response || !response.data)
                    throw `!response || !response.data`;

                const players: AllSports__Player[] = response.data.players
                    .map((playerContainer) => playerContainer.player)
                    .concat(
                        response.data.foreignPlayers.map(
                            (playerContainer) => playerContainer.player
                        )
                    )
                    .concat(
                        response.data.nationalPlayers.map(
                            (playerContainer) => playerContainer.player
                        )
                    );

                if (players.length === 0 || !players)
                    throw `players.length === 0 || !players for team: ${team.id} ${team.name}`;

                // const filtered = leagueSeasons.filter(
                //     (season: AllSports__LeagueSeason) =>
                //         Number(season.year) >= thisYear
                // );

                // if (filtered.length === 0) {
                //     console.warn(
                //         `No leagues THIS YEAR or NEXT YEAR for tournament: ${JSON.stringify(
                //             tournament
                //         )}`
                //     );
                //     continue;
                // }

                const dbPlayers: DB__Player[] = players.map(
                    (player: AllSports__Player) => ({
                        id: player.id,
                        name: player.name,
                        slug: player.slug,
                        shortName: player.shortName,
                        userCount: player.userCount,
                        position: player.position,
                        teamId: team.id,
                    })
                );

                const insertResult = await DB.INSERT_BATCH<DB__Player>(
                    dbPlayers,
                    TABLE_NAMES.cricketPlayers,
                    true
                );
                console.log(`Insert result: ${insertResult}`);
            } catch (e) {
                console.log(
                    `%cFailed to get team data with error: ${e}: ${team.id} ${team.name}`,
                    'color: orange'
                );
            }
            // return;
        }
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import * as dotenv from 'dotenv';
import { DB } from '../../types/namespaces/DB';
import { ASA } from '../../types/namespaces/ASA';
import fs from 'fs';
dotenv.config();

/**
 * We get the standings for every league
 * and with that we get the ids and info of the teams
 */
export async function getPlayerStatsByMatch__GENERIC(
    sportName: DB.SportName,
    DB: MYSQL_DB
) {
    // : Promise<boolean> {
    const funcName = `getPlayerStatsByMatch__GENERIC`;

    const playerTableName = `${sportName}.CORE__PLAYERS`;
    const playerStatisticsTableName = `${sportName}.RAPID__PLAYER_STATISTICS`;

    const hyphenated: string =
        sportName === 'AmericanFootball'
            ? 'american-football'
            : sportName.toLowerCase();
    const NFLTournamentId = 9464;

    let allKeys = new Set<string>();

    const NFL2324Id = '51361';
    const NFL2325Id = '60592';
    const templateUrl = `https://allsportsapi2.p.rapidapi.com/api/${hyphenated}/player/playerId/tournament/${NFLTournamentId}/season/seasonId/statistics/regularSeason`;

    try {
        const seasonIds = [NFL2324Id, NFL2325Id];
        const players: DB.Player[] = await DB.SELECT<DB.Player>(
            playerTableName
        );

        // for (const seasonId of seasonIds) {

        const seasonId = seasonIds[1];
        for (const player of players) {
            try {
                const url = templateUrl
                    .replace('seasonId', seasonId)
                    .replace('playerId', player.id);
                const headers = {
                    'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
                    'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
                };

                const axiosRequest = {
                    method: 'GET',
                    url,
                    headers,
                };

                const response = await axios.request(axiosRequest);
                if (!response.data) throw `!response.data`;
                if (!response.data.statistics) throw `!response.data.players`;
                const statistics = response.data
                    .statistics as ASA.PlayerStatistics;

                for (let key in statistics) {
                    allKeys.add(key);
                }

                const dbStatistics: DB.PlayerStatistics[] = [
                    {
                        ...statistics,
                        league_season_id: seasonId,
                        player_id: player.id,
                    },
                ];

                const { affected } = await DB.INSERT_BATCH_OVERWRITE(
                    dbStatistics,
                    playerStatisticsTableName
                );

                console.log(
                    `player: ${player.name} ${player.id} affected: ${affected}`
                );
            } catch (e) {
                console.error(
                    `error for player ${player.id} ${player.name}: ${e}`
                );
            }
            // finally {
            //     return;
            // }
        }

        // console.log(`allKeys: ${allKeys.size}`);
        // for (let key of allKeys) {
        //     console.log(`key: ${key}`);
        // }

        // const sqlCreateTable = `
        // DROP TABLE IF EXISTS ${playerStatisticsTableName};
        // CREATE TABLE IF NOT EXISTS ${playerStatisticsTableName} (
        //     league_season_id VARCHAR(255),
        //     player_id VARCHAR(255),
        //     ${Array.from(allKeys)
        //         // let's sort alphabetically
        //         .sort(
        //             (a, b) =>
        //                 a.toLowerCase().charCodeAt(0) -
        //                 b.toLowerCase().charCodeAt(0)
        //         )
        //         .map((key) => `${key} VARCHAR(20)`)
        //         .join(',\n')}
        // );
        // `;

        // fs.writeFileSync(`./sql/RAPID__PLAYER_STATISTICS.sql`, sqlCreateTable);

        return true;
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

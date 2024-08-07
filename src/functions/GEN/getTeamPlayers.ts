import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import * as dotenv from 'dotenv';
import { DB } from '../../types/namespaces/DB';
import { ASA } from '../../types/namespaces/ASA';
dotenv.config();

/**
 * We get the standings for every league
 * and with that we get the ids and info of the teams
 */
export async function getTeamsPlayers__GENERIC(
    sportName: DB.SportName,
    DB: MYSQL_DB
) {
    // : Promise<boolean> {
    const funcName = `getTeamsPlayers__${sportName}`;

    const teamTableName = `${sportName}.CORE__TEAMS`;
    const playerTableName = `${sportName}.CORE__PLAYERS`;

    const hyphenated: string =
        sportName === 'AmericanFootball'
            ? 'american-football'
            : sportName.toLowerCase();
    const templateUrl = `https://allsportsapi2.p.rapidapi.com/api/${hyphenated}/team/teamId/players`;

    try {
        const teams: DB.Team[] = await DB.SELECT<DB.Team>(teamTableName);

        // console.log(`teams: ${teams.length}`);

        if (teams.length === 0 || !teams) throw `teams.length === 0 || !teams`;

        for (const team of teams) {
            try {
                const url = templateUrl.replace('teamId', team.id);
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
                if (!response.data.players) throw `!response.data.players`;
                const players = response.data.players as {
                    player: ASA.Player;
                }[];

                const dbPlayers: DB.Player[] = players.map(({ player }) => {
                    return {
                        id: player.id,
                        team_id: team.id,
                        name: player.name,
                        position: player.position,
                        jersey_number: player.jerseyNumber,
                        height: player.height,
                        gender: player.gender,
                        shirt_number: player.shirtNumber,
                        user_count: player.userCount,
                        date_of_birth_timestamp: player.dateOfBirthTimestamp,
                    };
                });

                // const first: ASA.Player = players[0].player;

                // console.log(`response.data: ${JSON.stringify(first, null, 4)}`);
                // return;

                const { affected } = await DB.INSERT_BATCH_OVERWRITE(
                    dbPlayers,
                    playerTableName
                );

                console.log(
                    `affected: ${affected} for team: ${team.id} ${team.name}`
                );

                // return;
            } catch (e) {
                console.error(`error in team: ${team.id}: ${e}`);
            }
            // return;
        }
        return true;
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

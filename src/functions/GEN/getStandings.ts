import axios from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import * as dotenv from 'dotenv';
import { DB } from '../../types/namespaces/DB';
import { ASA } from '../../types/namespaces/ASA';
import { buildGetRequest } from '../Football/functions/buildGetRequest';
dotenv.config();

export async function getStandings__GENERIC(
    sportName: DB.SportName,
    DB: MYSQL_DB
): Promise<boolean> {
    const funcName = `getStandings__${sportName}`;

    const leagueTableName = `${sportName}.CORE__LEAGUESEASONS`;
    const teamTableName = `${sportName}.CORE__TEAMS`;

    const hyphenated: string =
        sportName === 'AmericanFootball'
            ? 'american-football'
            : sportName.toLowerCase();
    const templateUrl = `https://allsportsapi2.p.rapidapi.com/api/${hyphenated}/tournament/tournamentId/season/seasonId/standings/total`;

    try {
        let leaguesWithStandings = [];

        const leagueSeasons: DB.LeagueSeason[] =
            await DB.SELECT<DB.LeagueSeason>(leagueTableName);

        if (leagueSeasons.length === 0 || !leagueSeasons)
            throw `leagueSeasons.length === 0 || !leagueSeasons`;

        // console.warn(`leagueSeasons: ${leagueSeasons.length}`);
        // return;
        for (const ls of leagueSeasons) {
            try {
                const url = templateUrl
                    .replace('tournamentId', ls.tournament_id.toString())
                    .replace('seasonId', ls.id.toString());

                const request = buildGetRequest(url, {});

                const response = await axios.request(request);

                if (
                    !response ||
                    !response.data ||
                    !response.data.standings ||
                    response.data.standings.length === 0
                )
                    throw `!response || !response.data || !response.data.standings || response.data.standings.length`;

                for (const standing of response.data.standings) {
                    const dbStandings: DB.StandingsBase[] = standing.rows.map(
                        (row: ASA.TeamStandingsBase) => {
                            // console.log(
                            //     `ls.tournament_id: ${ls.tournament_id}`
                            // );
                            // console.log(Object.keys(row).join(', '));

                            // throw 'stop';

                            return {
                                league_season_id: ls.id,
                                team_id: row.team.id,
                                position: row.position,
                                points: row.points ?? null,
                                matches: row.matches ?? null,
                                wins: row.wins ?? null,
                                draws: row.draws ?? null,
                                losses: row.losses ?? null,
                                scores_for: row.scoresFor ?? null,
                                percentage: row.percentage ?? null,
                                net_run_rate: row.netRunRate ?? null,
                                streak: row.streak ?? null,
                            };
                        }
                    );

                    if (dbStandings.length === 0 || !dbStandings)
                        throw `dbStandings.length === 0 || !dbStandings for leagueSeason: ${ls.id} ${ls.name} ${ls.year}`;

                    const { affected } =
                        await DB.INSERT_BATCH_OVERWRITE<DB.StandingsBase>(
                            dbStandings,
                            `${sportName}.CORE__STANDINGS`
                        );

                    console.log(`Insert result: ${affected}`);
                }
            } catch (e) {
                console.log(
                    `%cFailed to get data for leagueSeason with error: ${e}: ${ls.id} ${ls.name}`,
                    'color: orange'
                );
            }
            // return;
        }
        console.log(
            `%cNumber of leagues with standings: ${leaguesWithStandings.length}`,
            'color: yellow'
        );
        return true;
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

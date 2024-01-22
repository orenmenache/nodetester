import axios from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { ASA } from '../../types/namespaces/ASA';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB } from '../../types/namespaces/DB';
import { formatDateToSQLTimestamp } from '../GEN/formatToMySQLTimestamp';
import { buildGetRequest } from '../Football/functions/buildGetRequest';
import { TENNIS } from '../../config/tables/TENNIS';

export default async function getStandings__TENNIS(DB: MYSQL_DB) {
    try {
        await DB.cleanTable(TENNIS.standings);

        const leagueSeasons = await DB.SELECT<DB.LeagueSeason>(
            TENNIS.leagueSeasons
        );

        //const ls = leagueSeasons[0];
        for (const ls of leagueSeasons) {
            if (!ls) {
                console.warn(`No leagueSeason`);
                continue;
            }
            if (!ls.tournament_id) {
                console.warn(`No tournament_id`);
                continue;
            }
            if (!ls.id) {
                console.warn(`No league id`);
                continue;
            }

            const axiosRequest = buildGetRequest(
                allSportsAPIURLs.TENNIS.standings,
                {
                    tournamentId: ls.tournament_id.toString(),
                    seasonId: ls.id.toString(),
                }
            );

            const response: ASA.Tennis.Responses.Standings =
                await axios.request(axiosRequest);

            // console.log(JSON.stringify(response.data.standings[0], null, 4));

            if (
                !response ||
                !response.data ||
                typeof response.data !== 'object' ||
                !('standings' in response.data) ||
                response.data.standings.length === 0 ||
                !('rows' in response.data.standings[0])
            ) {
                console.warn(`No standings for leagueSeason ${ls.name}`);
                // let's update the leagueSeason to say that it has no standings
                await DB.UPDATE(
                    TENNIS.leagueSeasons,
                    { has_standings: false },
                    { id: ls.id }
                );
                continue;
            }

            // let's update the leagueSeason to say that it has standings
            await DB.UPDATE(
                TENNIS.leagueSeasons,
                { has_standings: true },
                { id: ls.id }
            );

            let standingsDB: DB.StandingsBase[] = [];
            const when_created = formatDateToSQLTimestamp(new Date());

            for (const row of response.data.standings[0].rows) {
                if (
                    !row.team ||
                    !row.team.id ||
                    !row.position ||
                    (!row.matches && row.matches !== 0) ||
                    (!row.wins && row.wins !== 0) ||
                    (!row.losses && row.losses !== 0) ||
                    (!row.points && row.points !== 0)
                ) {
                    console.warn(
                        `Error in standings data for season ${
                            ls.name
                        }. Raw data: ${JSON.stringify(row)}`
                    );
                    continue;
                }

                const standings: DB.StandingsBase = {
                    id: String(row.id),
                    tournament_id: ls.tournament_id,
                    league_season_id: ls.id,
                    team_id: row.team.id,
                    position: String(row.position),
                    matches: String(row.matches),
                    wins: String(row.wins),
                    losses: String(row.losses),
                    points: String(row.points),
                    when_created,
                };
                standingsDB.push(standings);

                const TeamExists = await DB.SELECT<DB.Team>(TENNIS.teams, {
                    id: row.team.id,
                });

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
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    await DB.INSERT_BATCH<DB.Team>([team], TENNIS.teams, false);
                }
            }

            await DB.INSERT_BATCH<DB.StandingsBase>(
                standingsDB,
                TENNIS.standings,
                false
            );
            console.log(`Inserted ${standingsDB.length} standings`);
        }
    } catch (e) {
        console.warn(`Error in getStandings__TENNIS: ${e}`);
    }
}

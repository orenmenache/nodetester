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
            const axiosRequest = buildGetRequest(
                allSportsAPIURLs.TENNIS.standings,
                {
                    tournamentId: ls.tournament_id.toString(),
                    seasonId: ls.id.toString(),
                }
            );

            const response: ASA.TENNIS.Responses.Standings =
                await axios.request(axiosRequest);

            // console.log(JSON.stringify(response.data.standings[0], null, 4));

            if (
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

            let standingsDB: DB.TENNIS.Standings[] = [];
            const when_created = formatDateToSQLTimestamp(new Date());

            for (const row of response.data.standings[0].rows) {
                const standings: DB.TENNIS.Standings = {
                    id: row.id.toString(),
                    tournament_id: ls.tournament_id.toString(),
                    league_season_id: ls.id.toString(),
                    team_id: row.team.id.toString(),
                    position: row.position.toString(),
                    matches: row.matches.toString(),
                    wins: row.wins.toString(),
                    losses: row.losses.toString(),
                    points: row.points.toString(),
                    draws: row.draws.toString(),
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

            await DB.INSERT_BATCH<DB.TENNIS.Standings>(
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

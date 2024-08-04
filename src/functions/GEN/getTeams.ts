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
export async function getTeams__GENERIC(
    sportName: DB.SportName,
    DB: MYSQL_DB
): Promise<boolean> {
    const funcName = `getTeamsByTournamentAndSeason__${sportName}`;

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

        for (const ls of leagueSeasons) {
            try {
                const url = templateUrl
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

                const response = await axios.request(axiosRequest);

                if (
                    !response ||
                    !response.data ||
                    !response.data.standings ||
                    response.data.standings.length === 0
                )
                    throw `!response || !response.data || !response.data.standings || response.data.standings.length`;

                for (const standing of response.data.standings) {
                    const teams: ASA.Team[] = standing.rows.map(
                        (row: ASA.TeamStandingsBase) => row.team
                    );

                    if (teams.length === 0 || !teams)
                        throw `teams.length === 0 || !teams for leagueSeason: ${ls.id} ${ls.name} ${ls.year}`;

                    // console.log(
                    //     `first team: ${JSON.stringify(teams[0], null, 2)}`
                    // );

                    const dbTeams: DB.Team[] = teams.map((team: ASA.Team) => ({
                        id: team.id,
                        name: team.name,
                        slug: team.slug,
                        short_name: team.shortName,
                        name_code: team.nameCode,
                    }));

                    const insertResult =
                        await DB.INSERT_BATCH_OVERWRITE<DB.Team>(
                            dbTeams,
                            teamTableName
                        );
                    console.log(`Insert result: ${insertResult}`);
                    if (insertResult) {
                        console.log(`%c${JSON.stringify(ls)}`, 'color: cyan');
                        leaguesWithStandings.push(ls);
                    }
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

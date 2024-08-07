import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import * as dotenv from 'dotenv';
import { DB } from '../../types/namespaces/DB';
import { ASA } from '../../types/namespaces/ASA';
import { formatDateToSQLTimestamp } from './formatToMySQLTimestamp';
dotenv.config();

/**
 * We get the standings for every league
 * and with that we get the ids and info of the teams
 */
export async function getLastMatches__GENERIC(
    sportName: DB.SportName,
    DB: MYSQL_DB
) {
    // : Promise<boolean> {
    const funcName = `getLastMatches__GENERIC`;

    const leagueTableName = `${sportName}.CORE__LEAGUESEASONS`;
    const lastMatchesTableName = `${sportName}.RAPID__LASTMATCHES`;
    const NFLTournamentId = 9464;

    const hyphenated: string =
        sportName === 'AmericanFootball'
            ? 'american-football'
            : sportName.toLowerCase();
    const templateUrl = `https://allsportsapi2.p.rapidapi.com/api/${hyphenated}/tournament/tournamentId/season/seasonId/matches/last/pageNum`;

    try {
        const leagueSeasons: DB.LeagueSeason[] =
            await DB.SELECT<DB.LeagueSeason>(leagueTableName);

        // console.log(`leagueSeasons: ${leagueSeasons.length}`);
        // return;

        for (const ls of leagueSeasons) {
            for (let pageNum = 0; pageNum < 12; pageNum++) {
                try {
                    const url = templateUrl
                        .replace('seasonId', ls.id)
                        .replace('tournamentId', ls.tournament_id.toString())
                        .replace('pageNum', pageNum.toString());
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
                    if (!response.data.events) throw `!response.data.events`;

                    const events: ASA.AmericanFootball.Match[] = response.data
                        .events as ASA.AmericanFootball.Match[];

                    const dbLastMatches: DB.AmericanFootball.LastMatch[] =
                        events.map((event: ASA.AmericanFootball.Match) => {
                            return {
                                id: event.id,
                                tournament_id: NFLTournamentId.toString(),
                                league_season_id: ls.id,
                                home_team_id: event.homeTeam.id,
                                away_team_id: event.awayTeam.id,
                                winner_code: event.winnerCode, // 0: Draw, 1: Home, 2: Away
                                start_timestamp: formatDateToSQLTimestamp(
                                    new Date(
                                        Number(event.startTimestamp) * 1000
                                    )
                                ),
                                start_time_seconds: event.startTimestamp,
                                slug: event.slug || '',
                                status_code: event.status.code || '',
                                status_description:
                                    event.status.description || '',
                                status_type: event.status.type || '',
                                home_score_current:
                                    event.homeScore?.current || '',
                                home_score_display:
                                    event.homeScore?.display || '',
                                home_score_period1:
                                    event.homeScore?.period1 || '',
                                home_score_period2:
                                    event.homeScore?.period2 || '',
                                home_score_period3:
                                    event.homeScore?.period3 || '',
                                home_score_period4:
                                    event.homeScore?.period4 || '',
                                home_score_normaltime:
                                    event.homeScore?.normaltime || '',
                                away_score_current:
                                    event.awayScore?.current || '',
                                away_score_display:
                                    event.awayScore?.display || '',
                                away_score_period1:
                                    event.awayScore?.period1 || '',
                                away_score_period2:
                                    event.awayScore?.period2 || '',
                                away_score_period3:
                                    event.awayScore?.period3 || '',
                                away_score_period4:
                                    event.awayScore?.period4 || '',
                                away_score_normaltime:
                                    event.awayScore?.normaltime || '',
                                time_played: event.time?.played || '',
                                time_period_length:
                                    event.time?.periodLength || '',
                                time_overtime_length:
                                    event.time?.overtimeLength || '',
                                time_total_period_count:
                                    event.time?.totalPeriodCount || '',
                                time_current_period_timestamp:
                                    event.time?.currentPeriodTimestamp || '',
                                periods_current: event.periods?.current || '',
                                periods_period1: event.periods?.period1 || '',
                                periods_period2: event.periods?.period2 || '',
                                periods_period3: event.periods?.period3 || '',
                                periods_period4: event.periods?.period4 || '',
                                periods_overtime: event.periods?.overtime || '',
                                home_team_season_historical_form_wins:
                                    event.homeTeamSeasonHistoricalForm?.wins ||
                                    '',
                                home_team_season_historical_form_losses:
                                    event.homeTeamSeasonHistoricalForm
                                        ?.losses || '',
                                away_team_season_historical_form_wins:
                                    event.awayTeamSeasonHistoricalForm?.wins ||
                                    '',
                                away_team_season_historical_form_losses:
                                    event.awayTeamSeasonHistoricalForm
                                        ?.losses || '',
                            };
                        });

                    const { affected } = await DB.INSERT_BATCH_OVERWRITE(
                        dbLastMatches,
                        lastMatchesTableName
                    );

                    console.log(
                        `affected: ${affected} for league_season: ${ls.id} ${ls.name}`
                    );
                } catch (error) {
                    console.error(`error for league_season ${ls.id}: ${error}`);
                }
            }
        }
        return true;
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}

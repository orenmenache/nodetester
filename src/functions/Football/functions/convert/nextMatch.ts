import { ASA } from '../../../../types/namespaces/ASA';
import { DB } from '../../../../types/namespaces/DB';
import { formatDateToSQLTimestamp } from '../../../GEN/formatToMySQLTimestamp';

export function nextMatch(
    nextMatch: ASA.Football.NextMatch,
    seasonId: string
): DB.Football.NextMatch {
    return {
        tournament_id: nextMatch.tournament.uniqueTournament.id,
        league_season_id: seasonId,
        home_team_id: nextMatch.homeTeam.id,
        away_team_id: nextMatch.awayTeam.id,
        home_team_name: nextMatch.homeTeam.name,
        away_team_name: nextMatch.awayTeam.name,
        id: nextMatch.id,
        start_timestamp: formatDateToSQLTimestamp(
            new Date(Number(nextMatch.startTimestamp) * 1000)
        ),
        slug: nextMatch.slug,
        round: nextMatch.roundInfo.round,
    };
}

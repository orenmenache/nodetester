import { ASA } from './ASA';
import { MatchStatistics as MS } from '../DB/AmericanFootball/MatchStatistics';
import { Sport as S } from '../DB/Sport';

export namespace DB {
    export type Team = ASA.TeamBase & {
        short_name: string;
        name_code: string;
    };

    export type Sport = S;

    export type SportName =
        | 'Football'
        | 'Cricket'
        | 'Basketball'
        | 'Tennis'
        | 'Motorsport'
        | 'AmericanFootball';

    export type Category = ASA.CategoryBase & {
        sport_id: string;
    };

    export type Player = {
        id: string;
        team_id: string;
        name: string;
        position: string;
        jersey_number: string;
        height: string;
        user_count: string;
        gender: string;
        shirt_number: string;
        date_of_birth_timestamp: string;
    };

    export type PlayerStatistics = ASA.PlayerStatistics & {
        league_season_id: string;
        player_id: string;
    };

    export type LeagueSeason = ASA.LeagueSeason & {
        tournament_id: string;
        has_next_matches: boolean;
        has_last_matches: boolean;
        has_standings: boolean;
        has_last_matches_within_last_month: boolean;
        last_nextmatches_update?: string;
        last_standings_update?: string;
        last_lastmatches_update?: string;
    };

    export type Tournament = ASA.TournamentBase & {
        category_id: string;
    };

    export type StandingsBase = {
        id: string;
        tournament_id: string;
        league_season_id: string;
        team_id: string;
        position: string;
        matches: string;
        wins: string;
        losses: string;
        points: string;
        when_created: string;
    };

    export namespace Football {
        export type NextMatch = {
            id: string;
            tournament_id: string;
            league_season_id: string;
            start_time_timestamp: string;
            start_time_seconds: string;
            slug: string;
            home_team_id: string;
            away_team_id: string;
        };

        export type LastMatch = NextMatch & {
            winner_code: string;
            home_score: string;
            away_score: string;
        };

        export type Standings = StandingsBase & {
            draws: string;
            scores_for: string;
            scores_against: string;
        };
    }

    export namespace Cricket {
        export type Standings = StandingsBase & {
            draws: string;
        };
        export type NextMatch = {
            id: string;
            tournament_id: string;
            league_season_id: string;
            start_time_timestamp: string;
            start_time_seconds: string;
            slug: string;
            home_team_id: string;
            away_team_id: string;
        };
        export type LastMatch = NextMatch & {
            winner_code: string;
            home_score: string;
            away_score: string;
        };
    }

    export namespace Basketball {
        export type Standings = Omit<StandingsBase, 'matches' | 'points'> & {
            streak: string;
            percentage: string;
        };
        export type NextMatch = {
            id: string;
            tournament_id: string;
            league_season_id: string;
            start_time_timestamp: string;
            start_time_seconds: string;
            slug: string;
            home_team_id: string;
            away_team_id: string;
        };
    }

    export namespace Tennis {
        export type NextMatch = {
            id: string;
            tournament_id: string;
            league_season_id: string;
            start_time_timestamp: string;
            start_time_seconds: string;
            slug: string;
            home_team_id: string;
            away_team_id: string;
        };
    }

    export namespace Motorsport {
        export type Season = ASA.Motorsport.SeasonBase & {
            start_date: string;
            end_date: string;
            stage_id: string;
            category_id: string;
        };
    }

    export namespace AmericanFootball {
        export type MatchStatistics = MS.Item;
        export type LastMatch = {
            id: string;
            tournament_id: string;
            league_season_id: string;
            home_team_id: string;
            away_team_id: string;
            winner_code?: string; // 0: Draw, 1: Home, 2: Away
            start_timestamp: string;
            start_time_seconds: string;
            slug?: string;
            status_code?: string;
            status_description?: string;
            status_type?: string;
            home_score_current?: string;
            home_score_display?: string;
            home_score_period1?: string;
            home_score_period2?: string;
            home_score_period3?: string;
            home_score_period4?: string;
            home_score_normaltime?: string;
            away_score_current?: string;
            away_score_display?: string;
            away_score_period1?: string;
            away_score_period2?: string;
            away_score_period3?: string;
            away_score_period4?: string;
            away_score_normaltime?: string;
            time_played?: string;
            time_period_length?: string;
            time_overtime_length?: string;
            time_total_period_count?: string;
            time_current_period_timestamp?: string;
            periods_current?: string;
            periods_period1?: string;
            periods_period2?: string;
            periods_period3?: string;
            periods_period4?: string;
            periods_overtime?: string;
            home_team_season_historical_form_wins?: string;
            home_team_season_historical_form_losses?: string;
            away_team_season_historical_form_wins?: string;
            away_team_season_historical_form_losses?: string;
        };
    }
}

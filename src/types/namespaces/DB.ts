import { ASA } from './ASA';

export namespace DB {
    export type Team = ASA.TeamBase & {
        short_name: string;
        name_code: string;
    };

    export type Category = ASA.CategoryBase & {
        sport_id: string;
    };

    export type Player = ASA.Player & {
        teamId: string;
    };

    export type LeagueSeason = ASA.LeagueSeason & {
        tournament_id: string;
        has_next_matches: boolean;
        has_last_matches: boolean;
        has_standings: boolean;
        has_last_matches_within_last_month: boolean;
    };

    export type Tournament = ASA.TournamentBase & {
        category_id: string;
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
    }

    export namespace Cricket {}

    export namespace Tennis {}

    export namespace Motorsport {
        export type Season = ASA.Motorsport.SeasonBase & {
            start_date: string;
            end_date: string;
            stage_id: string;
            category_id: string;
        };
    }
}

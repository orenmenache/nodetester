export namespace MatchStatistics {
    export type Item = {
        match_id: string;
        group_name: string;
        name: string;
        home: string;
        away: string;
        compare_code: string;
        statistics_type: string;
        value_type: string;
        home_value: string;
        away_value: string;
        render_type: string;
        asa_key_name: string;
        home_total?: string;
        away_total?: string;
    };
}

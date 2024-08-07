DROP TABLE IF EXISTS AmericanFootball.RAPID__NEXTMATCHES;
CREATE TABLE IF NOT EXISTS AmericanFootball.RAPID__NEXTMATCHES (
    id INT PRIMARY KEY,
    tournament_id INT NOT NULL,
    league_season_id INT NOT NULL,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,

    FOREIGN KEY (league_season_id) REFERENCES AmericanFootball.CORE__LEAGUESEASONS(id),
    FOREIGN KEY (home_team_id) REFERENCES AmericanFootball.CORE__TEAMS(id),
    FOREIGN KEY (away_team_id) REFERENCES AmericanFootball.CORE__TEAMS(id),

    winner_code VARCHAR(20), -- 0: Draw, 1: Home, 2: Away
    start_timestamp VARCHAR(30) NOT NULL,
    start_time_seconds INT NOT NULL,
    slug VARCHAR(100),
    status_code VARCHAR(10),
    status_description VARCHAR(20),
    status_type VARCHAR(20),
    home_score_current VARCHAR(20),
    home_score_display VARCHAR(20),
    home_score_period1 VARCHAR(20),
    home_score_period2 VARCHAR(20),
    home_score_period3 VARCHAR(20),
    home_score_period4 VARCHAR(20),
    home_score_normaltime VARCHAR(20),
    away_score_current VARCHAR(20),
    away_score_display VARCHAR(20),
    away_score_period1 VARCHAR(20),
    away_score_period2 VARCHAR(20),
    away_score_period3 VARCHAR(20),
    away_score_period4 VARCHAR(20),
    away_score_normaltime VARCHAR(20),
    time_played VARCHAR(20),
    time_period_length VARCHAR(20),
    time_overtime_length VARCHAR(20),
    time_total_period_count VARCHAR(20),
    time_current_period_timestamp VARCHAR(20),
    periods_current VARCHAR(20),
    periods_period1 VARCHAR(20),
    periods_period2 VARCHAR(20),
    periods_period3 VARCHAR(20),
    periods_period4 VARCHAR(20),
    periods_overtime VARCHAR(20),
    home_team_season_historical_form_wins VARCHAR(20),
    home_team_season_historical_form_losses VARCHAR(20),
    away_team_season_historical_form_wins VARCHAR(20),
    away_team_season_historical_form_losses VARCHAR(20)
);


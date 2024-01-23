USE GeneralNews;
DROP TABLE IF EXISTS RAPID__NEXTMATCHES;
CREATE TABLE RAPID__NEXTMATCHES (
    id INT PRIMARY KEY,
    tournament_id INT NOT NULL,
    league_season_id INT NOT NULL,
    start_time_seconds INT,
    start_time_timestamp TIMESTAMP,
    slug VARCHAR(255),
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    sport_id INT NOT NULL,
    FOREIGN KEY (sport_id) REFERENCES config.sports(id)
);
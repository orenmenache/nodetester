USE ***dbName***;
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
    
    FOREIGN KEY (tournament_id) REFERENCES CORE__TOURNAMENTS(id),
    FOREIGN KEY (league_season_id) REFERENCES CORE__LEAGUESEASONS(id),
    FOREIGN KEY (home_team_id) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (away_team_id) REFERENCES CORE__TEAMS(id)
);
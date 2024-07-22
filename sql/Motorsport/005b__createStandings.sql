USE Motorsport;
DROP TABLE IF EXISTS RAPID__STANDINGS;
CREATE TABLE RAPID__STANDINGS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    team_name VARCHAR(255) NULL,
    league_season_id INT NOT NULL,
    position INT NOT NULL,
    wins INT NULL,
    points INT NULL,

    races_started INT,
    races_with_points INT,
    podiums INT,
    updated_seconds INT,
    updated_timestamp TIMESTAMP,

    -- PRIMARY KEY (team_id, league_season_id),
    FOREIGN KEY (team_id) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (league_season_id) REFERENCES CORE__LEAGUESEASONS(id)
)
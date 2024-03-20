DROP TABLE IF EXISTS Cricket.RAPID__TEAM_LASTMATCHES;
CREATE TABLE IF NOT EXISTS Cricket.RAPID__TEAM_LASTMATCHES (
    id INT PRIMARY KEY,

    start_time_seconds INT,
    start_time_timestamp TIMESTAMP,
    slug VARCHAR(255),

    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    home_team_name VARCHAR(255),
    away_team_name VARCHAR(255),

    winner_code INT NOT NULL, -- 0: Draw, 1: Home, 2: Away
    home_score INT NOT NULL,
    away_score INT NOT NULL,

    FOREIGN KEY (home_team_id) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (away_team_id) REFERENCES CORE__TEAMS(id)
);
DROP TABLE IF EXISTS RAPID__LASTMATCHES;
CREATE TABLE IF NOT EXISTS Cricket.RAPID__LASTMATCHES (
    id INT PRIMARY KEY,
    winner_code INT NOT NULL,
    home_score INT NOT NULL,
    away_score INT NOT NULL,
    start_timestamp TIMESTAMP,
    slug VARCHAR(255),
    tournament_id INT NOT NULL,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES CORE__TOURNAMENTS(id),
    FOREIGN KEY (home_team_id) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (away_team_id) REFERENCES CORE__TEAMS(id)
);
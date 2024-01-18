DROP TABLE IF EXISTS RAPID__NEXTMATCHES;
CREATE TABLE IF NOT EXISTS Cricket.RAPID__NEXTMATCHES (
    id INT PRIMARY KEY,
    round INT,
    start_timestamp TIMESTAMP,
    slug VARCHAR(255),
    tournament_id INT NOT NULL,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES CORE__TOURNAMENTS(id),
    FOREIGN KEY (home_team_id) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (away_team_id) REFERENCES CORE__TEAMS(id)
);
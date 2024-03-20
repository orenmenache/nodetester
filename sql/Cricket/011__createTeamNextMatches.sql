USE Cricket;
DROP TABLE IF EXISTS RAPID__TEAM_NEXTMATCHES;
CREATE TABLE RAPID__TEAM_NEXTMATCHES (
    id INT PRIMARY KEY,

    start_time_seconds INT,
    start_time_timestamp TIMESTAMP,
    slug VARCHAR(255),
    
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    
    FOREIGN KEY (home_team_id) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (away_team_id) REFERENCES CORE__TEAMS(id)
);
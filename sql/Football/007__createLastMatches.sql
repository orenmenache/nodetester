USE Cricket;
DROP TABLE IF EXISTS RAPID__LASTMATCHES;
CREATE TABLE RAPID__LASTMATCHES (
    id INT PRIMARY KEY,
    round INT,
    winnerCode INT NOT NULL,
    homeScore INT NOT NULL,
    awayScore INT NOT NULL,
    startTimestamp TIMESTAMP,
    slug VARCHAR(255),
    tournament_id INT NOT NULL,
    homeTeamId INT NOT NULL,
    awayTeamId INT NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES CORE__TOURNAMENTS(id),
    FOREIGN KEY (homeTeamId) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (awayTeamId) REFERENCES CORE__TEAMS(id)
);
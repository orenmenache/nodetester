-- DROP TABLE IF EXISTS RAPID__LASTMATCHES;
CREATE TABLE IF NOT EXISTS Cricket.RAPID__LASTMATCHES (
    id INT PRIMARY KEY,
    winnerCode INT NOT NULL,
    homeScore INT NOT NULL,
    awayScore INT NOT NULL,
    startTimestamp TIMESTAMP,
    slug VARCHAR(255),
    tournament_id INT NOT NULL,
    homeTeamId INT NOT NULL,
    homeTeamName VARCHAR(255),
    awayTeamId INT NOT NULL,
    awayTeamName VARCHAR(255),
    note VARCHAR(255),
    FOREIGN KEY (tournament_id) REFERENCES CORE__TOURNAMENTS(id),
    FOREIGN KEY (homeTeamId) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (awayTeamId) REFERENCES CORE__TEAMS(id)
);
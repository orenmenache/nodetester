-- not sure yet if player statistics is per player or per league
USE Cricket;
DROP TABLE IF EXISTS CORE__STATISTICS;
CREATE TABLE CORE__STATISTICS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    innings INT,
    battingInnings INT,
    battingMatches INT,
    runsScored INT,
    hundreds INT,
    matches INT,
    type VARCHAR(250),
    appearances INT,
    category VARCHAR(250) NOT NULL,
    playerId INT NOT NULL,
    teamId INT NOT NULL,
    leagueSeasonId INT NOT NULL,
    FOREIGN KEY (playerId) REFERENCES CORE__PLAYERS(id),
    FOREIGN KEY (teamId) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (leagueSeasonId) REFERENCES CORE__LEAGUESEASONS(id)
)
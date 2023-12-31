USE Cricket;
DROP TABLE IF EXISTS CORE__TEAMS;
CREATE TABLE CORE__TEAMS (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    shortName VARCHAR(255) NOT NULL,
    userCount VARCHAR(255),
    type VARCHAR(255),
    leagueSeasonId INT NOT NULL,
    FOREIGN KEY (leagueSeasonId) REFERENCES CORE__LEAGUESEASONS(id)
)
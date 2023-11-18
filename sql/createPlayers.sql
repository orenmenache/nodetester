USE Cricket;
DROP TABLE IF EXISTS CORE__PLAYERS;
CREATE TABLE CORE__PLAYERS (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    shortName VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    userCount INT,
    teamId INT NOT NULL,
    FOREIGN KEY (teamId) REFERENCES CORE__TEAMS(id)
)
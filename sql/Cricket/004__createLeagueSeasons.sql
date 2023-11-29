-- DROP TABLE IF EXISTS Cricket.CORE__LEAGUESEASONS;
CREATE TABLE IF NOT EXISTS Cricket.CORE__LEAGUESEASONS (
    id INT PRIMARY KEY,
    editor BOOLEAN,
    name VARCHAR(255) NOT NULL,
    year VARCHAR(10) NOT NULL,
    hasNextMatches BOOLEAN NOT NULL,
    hasLastMatches BOOLEAN NOT NULL,
    tournament_id INT NOT NULL,
    woman BOOLEAN NOT NULL,
FOREIGN KEY (tournament_id) REFERENCES CORE__TOURNAMENTS(id)
)
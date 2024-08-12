USE ***dbName***;
DROP TABLE IF EXISTS CORE__LEAGUESEASONS;
CREATE TABLE IF NOT EXISTS CORE__LEAGUESEASONS (
    id INT PRIMARY KEY,
    tournament_id INT NOT NULL,

    name VARCHAR(100) NOT NULL,
    year VARCHAR(10) NOT NULL,
    has_next_matches BOOLEAN NOT NULL DEFAULT 0,
    has_last_matches BOOLEAN NOT NULL DEFAULT 0,
    has_last_matches_within_last_month BOOLEAN NOT NULL DEFAULT 0,
    has_standings BOOLEAN NOT NULL DEFAULT 0,
    last_standings_update TIMESTAMP,
    last_nextmatches_update TIMESTAMP,
    last_lastmatches_update TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES CORE__TOURNAMENTS(id)
)
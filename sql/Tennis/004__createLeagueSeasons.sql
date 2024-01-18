DROP TABLE IF EXISTS Tennis.CORE__LEAGUESEASONS;
CREATE TABLE IF NOT EXISTS Tennis.CORE__LEAGUESEASONS (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    year VARCHAR(10) NOT NULL,
    has_next_matches BOOLEAN NOT NULL,
    has_last_matches BOOLEAN NOT NULL,
    has_last_matches_within_last_month BOOLEAN NOT NULL,
    has_standings BOOLEAN NOT NULL,
    tournament_id INT NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES CORE__TOURNAMENTS(id)
)
DROP TABLE IF EXISTS Motorsport.CORE__LEAGUESEASONS;
CREATE TABLE Motorsport.CORE__LEAGUESEASONS (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    year VARCHAR(20) NULL,

    has_next_matches BOOLEAN NOT NULL,
    has_last_matches BOOLEAN NOT NULL,
    has_last_matches_within_last_month BOOLEAN NOT NULL,
    has_standings BOOLEAN NOT NULL,
    last_standings_update TIMESTAMP,
    last_nextmatches_update TIMESTAMP,

    stage_id INT NOT NULL,
    FOREIGN KEY (stage_id) REFERENCES CORE__STAGES(id),
    
    start_date_seconds INT NOT NULL,
    end_date_seconds INT NOT NULL,
    start_date_date DATE NOT NULL,
    end_date_date DATE NOT NULL,

    slug VARCHAR(255) NOT NULL,
    description VARCHAR(255) NULL
);
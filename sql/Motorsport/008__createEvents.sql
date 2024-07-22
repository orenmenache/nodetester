DROP TABLE IF EXISTS Motorsport.RAPID__EVENTS;
CREATE TABLE Motorsport.RAPID__EVENTS (
    id INT PRIMARY KEY,                              -- Unique identifier for the event
    league_season_id INT NOT NULL,             -- ID of the unique stage season
    league_season_name VARCHAR(255) NOT NULL,  -- Name of the unique stage season
    slug VARCHAR(255),                               -- Slug of the event
    description VARCHAR(255),                        -- Description of the event
    status_description VARCHAR(255),                 -- Status description
    status_type VARCHAR(255),                        -- Status type
    info_circuit VARCHAR(255) NULL,                  -- Circuit name, nullable
    info_circuitCity VARCHAR(255) NULL,              -- Circuit city, nullable
    info_circuitLength INT NULL,                     -- Circuit length in meters, nullable
    start_date_seconds BIGINT,                       -- Start date as UNIX timestamp in seconds
    end_date_seconds BIGINT NULL,                    -- End date as UNIX timestamp in seconds, nullable
    start_date_timestamp TIMESTAMP,                  -- Start date as MySQL TIMESTAMP
    end_date_timestamp TIMESTAMP NULL,               -- End date as MySQL TIMESTAMP, nullable
    winner_id INT NULL,                              -- Winner ID, nullable
    winner_name VARCHAR(255) NULL,                   -- Winner name, nullable
    winner_slug VARCHAR(255) NULL,                   -- Winner slug, nullable
    winner_shortName VARCHAR(255) NULL,              -- Winner short name, nullable
    
    FOREIGN KEY (league_season_id) REFERENCES Motorsport.CORE__LEAGUESEASONS(id)
);
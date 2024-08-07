DROP TABLE IF EXISTS AmericanFootball.CORE__PLAYERS;
CREATE TABLE AmericanFootball.CORE__PLAYERS (
    id VARCHAR(255) PRIMARY KEY,
    team_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    jersey_number VARCHAR(255),
    height VARCHAR(255),
    -- retired BOOLEAN NOT NULL,
    user_count VARCHAR(255),
    -- deceased BOOLEAN NOT NULL,
    gender VARCHAR(255),
    shirt_number VARCHAR(255),
    date_of_birth_timestamp VARCHAR(255)
);
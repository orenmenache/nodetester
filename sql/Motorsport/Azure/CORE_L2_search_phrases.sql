DROP TABLE IF EXISTS config.CORE_L2_search_phrases;
CREATE TABLE config.CORE_L2_search_phrases
(
    sport_name VARCHAR(255) NOT NULL,
    search_phrase VARCHAR(255) NOT NULL,
    PRIMARY KEY (sport_name, search_phrase),
    FOREIGN KEY (sport_name) REFERENCES config.CORE_L1_sports(name)
);
USE Baseball;

DROP TABLE IF EXISTS RAPID__TRANS_NEWS;
DROP TABLE IF EXISTS RAPID__NEWS;

CREATE TABLE RAPID__NEWS (
    id VARCHAR(10) PRIMARY KEY,
    headline VARCHAR(255) NOT NULL,
    sub_headline VARCHAR(255) NOT NULL,
    narration TEXT NOT NULL,
    when_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    background VARCHAR(255),
    show_standings BOOLEAN NOT NULL,
    show_next_matches BOOLEAN NOT NULL,
    standings_league_season_id INT,
    schedule_league_season_id INT,
    logo VARCHAR(255)
);

CREATE TABLE RAPID__TRANS_NEWS (
    lang VARCHAR(10) NOT NULL,
    item_id VARCHAR(10) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    sub_headline VARCHAR(255) NOT NULL,
    narration TEXT NOT NULL,
    file_name VARCHAR (20) NOT NULL,
    when_created TIMESTAMP NOT NULL,
    PRIMARY KEY (item_id, lang),
    FOREIGN KEY (item_id) REFERENCES RAPID__NEWS(id),
    FOREIGN KEY (lang) REFERENCES config.langs(name)
);
USE Motorsport;

DROP TABLE IF EXISTS RAPID__NEWS;
CREATE TABLE RAPID__NEWS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    headline VARCHAR(255) NOT NULL,
    sub_headline VARCHAR(255) NOT NULL,
    narration TEXT NOT NULL,
    when_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    background VARCHAR(255),
    logo VARCHAR(255),

    show_standings BOOLEAN NOT NULL DEFAULT FALSE,
    show_next_matches BOOLEAN NOT NULL DEFAULT FALSE,
    standings_league_season_id INT,
    schedule_league_season_id INT,

    FOREIGN KEY (standings_league_season_id) REFERENCES CORE__LEAGUESEASONS(id),
    FOREIGN KEY (schedule_league_season_id) REFERENCES CORE__LEAGUESEASONS(id)
);

DROP TABLE IF EXISTS RAPID__TRANS_NEWS;
CREATE TABLE RAPID__TRANS_NEWS (
    lang VARCHAR(10) NOT NULL,
    item_id INT NOT NULL,
    headline VARCHAR(255) NOT NULL,
    sub_headline VARCHAR(255) NOT NULL,
    narration TEXT NOT NULL,
    file_name VARCHAR (20) NOT NULL,
    when_created TIMESTAMP NOT NULL,
    PRIMARY KEY (item_id, lang),
    FOREIGN KEY (item_id) REFERENCES RAPID__NEWS(id),
    FOREIGN KEY (lang) REFERENCES config.langs(name)
);
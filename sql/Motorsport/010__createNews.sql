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
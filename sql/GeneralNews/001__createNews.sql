USE GeneralNews;
DROP TABLE IF EXISTS RAPID__NEWS;
CREATE TABLE RAPID__NEWS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sport_id INT NOT NULL,
    headline VARCHAR(255) NOT NULL,
    sub_headline VARCHAR(255) NOT NULL,
    narration TEXT NOT NULL,
    when_created TIMESTAMP NOT NULL,
    background VARCHAR(255) NOT NULL,
    logo VARCHAR(255) NOT NULL,
    show_standings BOOLEAN NOT NULL,
    show_next_matches BOOLEAN NOT NULL,
    league_season_id INT,
    Foreign Key (sport_id) references config.sports(id)
);
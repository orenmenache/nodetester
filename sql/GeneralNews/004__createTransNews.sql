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

SELECT n.id, n.sport_id, tn.headline, tn.sub_headline, tn.narration, n.when_created, n.background, n.logo, n.show_standings, n.show_next_matches, n.league_season_id
FROM RAPID__NEWS n
JOIN RAPID__TRANS_NEWS tn ON n.id = tn.item_id
WHERE tn.lang = 'HI';

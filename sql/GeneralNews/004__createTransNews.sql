USE GeneralNews;
DROP TABLE IF EXISTS RAPID__TRANS_NEWS;
CREATE TABLE RAPID__TRANS_NEWS (
    id INT NOT NULL,
    lang VARCHAR(10) NOT NULL,
    sport_id INT NOT NULL,
    item_id INT NOT NULL,
    headline VARCHAR(255) NOT NULL,
    sub_headline VARCHAR(255) NOT NULL,
    narration TEXT NOT NULL,
    when_created TIMESTAMP NOT NULL,
    PRIMARY KEY (id, lang),
    FOREIGN KEY (sport_id) REFERENCES config.sports(id),
    FOREIGN KEY (item_id) REFERENCES RAPID__NEWS(id),
    FOREIGN KEY (lang) REFERENCES config.langs(name)
);
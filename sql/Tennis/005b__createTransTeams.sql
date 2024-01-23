USE Tennis;
DROP TABLE IF EXISTS CORE__TRANS_TEAMS;
CREATE TABLE CORE__TRANS_TEAMS (
    id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    lang VARCHAR(10) NOT NULL,
    PRIMARY KEY (id, lang),
    FOREIGN KEY (lang) REFERENCES config.langs(name),
    FOREIGN KEY (id) REFERENCES CORE__TEAMS(id)
)
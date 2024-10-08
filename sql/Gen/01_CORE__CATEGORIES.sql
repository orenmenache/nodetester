USE Baseball;
DROP TABLE IF EXISTS CORE__CATEGORIES;
CREATE TABLE CORE__CATEGORIES (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    priority INT NOT NULL,
    flag VARCHAR(255) NOT NULL,
    alpha2 VARCHAR(2),
    sport_name VARCHAR(40) NOT NULL,
    covered BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (sport_name) REFERENCES config.CORE_L1_sports(name)
);
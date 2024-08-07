DROP TABLE IF EXISTS AmericanFootball.CORE__CATEGORIES;
CREATE TABLE AmericanFootball.CORE__CATEGORIES (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    priority INT NOT NULL,
    flag VARCHAR(255) NOT NULL,
    alpha2 VARCHAR(2),
    sport_id INT NOT NULL
);
DROP TABLE IF EXISTS Motorsport.CORE__CATEGORIES;
CREATE TABLE Motorsport.CORE__CATEGORIES (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    priority INT NOT NULL,
    flag VARCHAR(255) NOT NULL,
    sport_id INT,
    FOREIGN KEY (sport_id) REFERENCES config.sports(id)
);
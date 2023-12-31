-- DROP TABLE IF EXISTS CORE__TOURNAMENTS;
CREATE TABLE IF NOT EXISTS Cricket.CORE__TOURNAMENTS (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    primaryColorHex VARCHAR(7),
    secondaryColorHex VARCHAR(7),
    category_id INT NOT NULL,
    userCount INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES CORE__CATEGORIES(id)
);
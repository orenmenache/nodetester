DROP TABLE IF EXISTS AmericanFootball.CORE__TOURNAMENTS;
CREATE TABLE AmericanFootball.CORE__TOURNAMENTS (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,

    start_date_seconds VARCHAR(20),
    start_date_timestamp TIMESTAMP,
    end_date_seconds VARCHAR(20),
    end_date_timestamp TIMESTAMP;

    FOREIGN KEY (category_id) REFERENCES CORE__CATEGORIES(id)
);
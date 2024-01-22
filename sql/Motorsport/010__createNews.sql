USE Motorsport;
DROP TABLE IF EXISTS RAPID__NEWS;
CREATE TABLE RAPID__NEWS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    headline VARCHAR(255) NOT NULL,
    subheadline VARCHAR(255) NOT NULL,
    narration TEXT NOT NULL,
    when_created TIMESTAMP,
    background VARCHAR(255),
    logo VARCHAR(255)
);
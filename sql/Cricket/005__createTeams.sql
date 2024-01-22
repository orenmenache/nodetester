USE Cricket;
DROP TABLE IF EXISTS CORE__TEAMS;
CREATE TABLE CORE__TEAMS (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    short_name VARCHAR(255) NOT NULL,
    name_code VARCHAR(255) NOT NULL
)
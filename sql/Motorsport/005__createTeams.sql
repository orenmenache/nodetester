USE Motorsport;
DROP TABLE IF EXISTS CORE__TEAMS;
CREATE TABLE CORE__TEAMS (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    short_name VARCHAR(255) NOT NULL,
    name_code VARCHAR(10) NOT NULL,
    gender VARCHAR(1),
    national BOOLEAN NOT NULL,

    country_name VARCHAR(255),
    country_alpha2 VARCHAR(2),
    country_alpha3 VARCHAR(3)
)
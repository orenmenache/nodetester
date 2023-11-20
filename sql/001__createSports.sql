USE config;
DROP TABLE IF EXISTS sports;
CREATE TABLE sports (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL
);

INSERT INTO sports (id, name, slug)
VALUES
('62','Cricket','cricket'),
('1','Football','football');
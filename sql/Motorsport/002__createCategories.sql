DROP TABLE IF EXISTS Motorsport.CORE__CATEGORIES;

CREATE TABLE Motorsport.CORE__CATEGORIES (
    id INT PRIMARY KEY,                    -- Unique identifier for the category
    name VARCHAR(255) NOT NULL,            -- Name of the category
    slug VARCHAR(255) NOT NULL,            -- URL-friendly identifier for the category
    sport_id INT NOT NULL,                 -- Foreign key to sports table
    priority INT,                          -- Priority of the category
    flag VARCHAR(255)                      -- Identifier flag
);
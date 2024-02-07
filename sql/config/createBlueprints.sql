-- Our three main data arrays are newsItems, standings and schedules
-- for the news we'll be taking always headline, sub_headline, narration, background, logo per item
-- however, with standings and schedule they are conditional and their array length is variable.
-- hence, the structure of the bluePrints table

DROP TABLE IF EXISTS config.blueprints;
CREATE TABLE config.blueprints (
    name VARCHAR(255) NOT NULL PRIMARY KEY,
    description TEXT,
    type VARCHAR(255),
    news_database_name VARCHAR(255) NOT NULL
);

INSERT INTO config.blueprints (name, description, type, news_database_name) VALUES
('generalnews_five_items', 'mixed sports, always 5 items with possible standings and schedule', NULL, 'GeneralNews');

-- interface Blueprint {
--     name: string;
--     description?: string;
--     type?: string;
--     news_database_name: string;
-- }
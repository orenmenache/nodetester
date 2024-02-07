-- -- this is instead of running a query in the backend
-- -- all the data is preprepared and ready to be used
-- -- just like pre rendering

-- DROP TABLE IF EXISTS GeneralNews.RAPID__PROCESSED_NEWSITEMS;
-- CREATE TABLE IF NOT EXISTS GeneralNews.RAPID__PROCESSED_NEWSITEMS (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     sport_id INT NOT NULL,
--     headline VARCHAR(255) NOT NULL,
--     sub_headline VARCHAR(255) NOT NULL,
--     narration TEXT NOT NULL,
--     when_created TIMESTAMP NOT NULL,
--     background VARCHAR(255) NOT NULL,
--     logo VARCHAR(255) NOT NULL,
--     show_standings BOOLEAN NOT NULL,
--     show_next_matches BOOLEAN NOT NULL,
--     -- we're not referencing a table here cause we don't know what sport this is for
--     league_season_id INT, 
--     Foreign Key (sport_id) references config.sports(id)

--     -- so far this is identical to the RAPID__NEWS table

--     lang VARCHAR(10) NOT NULL,
--     item_id INT NOT NULL,
--     sport_name VARCHAR(255) NOT NULL,

-- );
USE GeneralNews;
DROP TABLE IF EXISTS RAPID__STANDINGS;
CREATE TABLE RAPID__STANDINGS (
    id INT PRIMARY KEY,
    tournament_id INT NOT NULL,
    league_season_id INT NOT NULL,
    team_id INT NOT NULL,
    position INT NOT NULL,
    matches INT,
    wins INT,
    draws INT,
    losses INT,
    points INT,
    when_created TIMESTAMP
);
USE Basketball;
DROP TABLE IF EXISTS RAPID__STANDINGS;
CREATE TABLE RAPID__STANDINGS (
    id INT PRIMARY KEY,
    tournament_id INT NOT NULL,
    league_season_id INT NOT NULL,
    team_id INT NOT NULL,
    position INT NOT NULL,
    streak INT,
    wins INT,
    draws INT,
    losses INT,
    percentage INT,
    when_created TIMESTAMP,
    
    FOREIGN KEY (tournament_id) REFERENCES CORE__TOURNAMENTS(id),
    FOREIGN KEY (league_season_id) REFERENCES CORE__LEAGUESEASONS(id),
    FOREIGN KEY (team_id) REFERENCES CORE__TEAMS(id)
);
USE Football;
DROP TABLE IF EXISTS CORE__STANDINGS;
CREATE TABLE CORE__STANDINGS (
    team_id INT NOT NULL,
    league_season_id INT NOT NULL,
    position INT NOT NULL,
    matches INT NOT NULL,
    scores_for INT NOT NULL,
    scores_against INT NOT NULL,
    wins INT NOT NULL,
    draws INT NOT NULL,
    losses INT NOT NULL,
    points INT NOT NULL,
    PRIMARY KEY (team_id, league_season_id),
    FOREIGN KEY (team_id) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (league_season_id) REFERENCES CORE__LEAGUESEASONS(id)
)
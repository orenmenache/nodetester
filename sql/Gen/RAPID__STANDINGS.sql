USE ***dbName***;
DROP TABLE IF EXISTS CORE__STANDINGS;
CREATE TABLE CORE__STANDINGS (
    team_id INT NOT NULL,
    league_season_id INT NOT NULL,
    position INT NOT NULL,
    matches INT,
    scores_for INT,
    scores_against INT,
    wins INT,
    draws INT,
    losses INT,
    points INT,
    net_run_rate VARCHAR(20), -- cricket only
    percentage VARCHAR(20), -- basketball only
    streak VARCHAR(5), -- basketball only

    when_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, league_season_id),
    FOREIGN KEY (team_id) REFERENCES CORE__TEAMS(id),
    FOREIGN KEY (league_season_id) REFERENCES CORE__LEAGUESEASONS(id)
)
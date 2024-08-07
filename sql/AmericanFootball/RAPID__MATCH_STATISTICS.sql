DROP TABLE IF EXISTS AmericanFootball.RAPID__MATCH_STATISTICS;
CREATE TABLE AmericanFootball.RAPID__MATCH_STATISTICS (
    match_id INT NOT NULL,
    group_name VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    home VARCHAR(20) NOT NULL,
    away VARCHAR(20) NOT NULL,
    compare_code VARCHAR(10) NOT NULL,
    statistics_type VARCHAR(10) NOT NULL,
    value_type VARCHAR(10) NOT NULL,
    home_value VARCHAR(10) NOT NULL,
    away_value VARCHAR(10) NOT NULL,
    render_type VARCHAR(10) NOT NULL,
    asa_key_name VARCHAR(30) NOT NULL,
    home_total VARCHAR(10),
    away_total VARCHAR(10),
    PRIMARY KEY (match_id, group_name, asa_key_name),
    FOREIGN KEY (match_id) REFERENCES AmericanFootball.RAPID__LASTMATCHES(id)
);
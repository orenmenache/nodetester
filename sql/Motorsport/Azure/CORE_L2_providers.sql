DROP TABLE IF EXISTS config.CORE_L2_providers;
CREATE TABLE config.CORE_L2_providers
(
    sport_name VARCHAR(255) NOT NULL,
    provider_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (sport_name, provider_name),
    FOREIGN KEY (sport_name) REFERENCES config.CORE_L1_sports(name)
);

INSERT INTO config.CORE_L2_providers (sport_name, provider_name) 
VALUES 

('Basketball', 'espn.com'),
('Basketball', 'bbc.com'),
('Basketball', 'skysports.com'),
('Basketball', 'nbcsports.com'),
('Basketball', 'reuters.com'),
('Basketball', 'cnn.com'),
('Basketball', 'bleacherreport.com'),
('Basketball', 'dazn.com'),

('Football', 'espn.com'),
('Football', 'bbc.com'),
('Football', 'skysports.com'),
('Football', 'nbcsports.com'),
('Football', 'reuters.com'),
('Football', 'cnn.com'),
('Football', 'bleacherreport.com'),
('Football', 'dazn.com'),

('Tennis', 'espn.com'),
('Tennis', 'bbc.com'),
('Tennis', 'skysports.com'),
('Tennis', 'nbcsports.com'),
('Tennis', 'reuters.com'),
('Tennis', 'cnn.com'),
('Tennis', 'bleacherreport.com'),
('Tennis', 'dazn.com'),

('Cricket', 'espn.com'),
('Cricket', 'bbc.com'),
('Cricket', 'skysports.com'),
('Cricket', 'nbcsports.com'),
('Cricket', 'reuters.com'),
('Cricket', 'cnn.com'),
('Cricket', 'bleacherreport.com'),
('Cricket', 'dazn.com'),

-- ('Baseball', 'espn.com'),
-- ('Baseball', 'bbc.com'),
-- ('Baseball', 'skysports.com'),
-- ('Baseball', 'nbcsports.com'),
-- ('Baseball', 'reuters.com'),
-- ('Baseball', 'cnn.com'),
-- ('Baseball', 'bleacherreport.com'),
-- ('Baseball', 'dazn.com'),

('Motorsport', 'espn.com'),
('Motorsport', 'bbc.com'),
('Motorsport', 'skysports.com'),
('Motorsport', 'nbcsports.com'),
('Motorsport', 'reuters.com'),
('Motorsport', 'cnn.com'),
('Motorsport', 'bleacherreport.com'),
('Motorsport', 'dazn.com');
('Motorsport', 'formula1.com'),
('Motorsport', 'motogp.com'),
('Motorsport', 'nascar.com'),
('Motorsport', 'indycar.com'),
('Motorsport', 'motorsport.com'),
('Motorsport', 'formulae.com');

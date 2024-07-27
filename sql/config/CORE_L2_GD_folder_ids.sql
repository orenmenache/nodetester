DROP TABLE IF EXISTS config.CORE_L2_GD_folder_ids;
CREATE TABLE config.CORE_L2_GD_folder_ids (
    sport_name VARCHAR(255) NOT NULL,
    lang_code VARCHAR(5) NOT NULL,
    google_drive_folder_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (sport_name) REFERENCES config.CORE_L1_sports(name),
    FOREIGN KEY (lang_code) REFERENCES config.CORE_L1_langs(lang),
    PRIMARY KEY (sport_name, lang_code)
);

INSERT INTO config.CORE_L2_GD_folder_ids (sport_name, lang_code, google_drive_folder_id) 
VALUES
('Motorsport', 'EN', '1eBIzkjO1VvXMyLWmjqTMceMVy1SoUcBA');
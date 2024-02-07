DROP TABLE IF EXISTS config.editions;
CREATE TABLE config.editions (
    brand_name VARCHAR(255) NOT NULL,
	lang VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    blueprint VARCHAR(255) NOT NULL,
    export_file_name VARCHAR(255) NOT NULL,
    project_file_name VARCHAR(255) NOT NULL,
    project_save_file_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (brand_name, lang),
    FOREIGN KEY (blueprint) REFERENCES config.blueprints(name)
);

INSERT INTO config.editions (brand_name, lang, active, blueprint, export_file_name, project_file_name, project_save_file_name) VALUES
('CWINZ', 'HI', true, 'generalnews_five_items', 'export test.mp4', 'General sports reduced AE241.aep', 'save test.aep');
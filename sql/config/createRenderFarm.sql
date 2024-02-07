DROP TABLE IF EXISTS config.renderFarm;
CREATE TABLE config.renderFarm (
	name VARCHAR(10) PRIMARY KEY,
    os VARCHAR(10) NOT NULL CHECK (os in ('mac','win')),
    root_user_name VARCHAR(50) NOT NULL,
    drive_path VARCHAR(250) NOT NULL,
    local_storage_path VARCHAR(250) NOT NULL,
    qnap_path VARCHAR(250),
    extensions_path VARCHAR(250), 
    average_edition_rendering_time_in_seconds INT,
    machine_type VARCHAR(10) NOT NULL CHECK (machine_type IN ('dev', 'prod'))
);

INSERT INTO config.renderFarm (name, os, root_user_name, drive_path, local_storage_path, qnap_path, extensions_path, average_edition_rendering_time_in_seconds, machine_type)
VALUES
('David''s PC', 'win', 'david', 'C:/VF_MockDrive/', 'Q:/', 'C:/Users/david/AppData/Roaming/Adobe/CEP/extensions/', NULL, NULL, 'dev'),
('NF1', 'mac', 'newsfactoryserviceslimited', '/Users/newsfactoryserviceslimited/Library/CloudStorage/GoogleDrive-studio@motionhive.tv/My Drive/', '/Users/newsfactoryserviceslimited/', '/Library/Application Support/Adobe/CEP/extensions/', NULL, NULL, 'prod'),
('NF12', 'win', 'NF12', 'G:/My Drive/', 'Q:/', 'C:/Users/NF12/AppData/Roaming/Adobe/CEP/extensions/', 'Z:/', NULL, 'prod'),
('NF4', 'mac', 'nf4', '/Users/nf4/Library/CloudStorage/GoogleDrive-studio@motionhive.tv/My Drive/', '/Users/nf4/', '/Library/Application Support/Adobe/CEP/extensions/', NULL, 600, 'prod'),
('NF5', 'win', 'NF5', 'G:/My Drive/', 'Q:/', 'C:/Users/NF5/AppData/Roaming/Adobe/CEP/extensions/', 'Z:/', NULL, 'prod'),
('Oren''s PC', 'win', 'User', 'D:/dummydrive/', 'D:/dummydrive/', 'noneed', NULL, NULL, 'dev'),
('Oren2', 'mac', 'oren', 'D:/dummydrive/', 'D:/dummydrive/', 'noneed', NULL, NULL, 'dev'),
('Render 1', 'win', 'Render1', 'G:/My Drive/', 'Q:/', 'C:/Users/Render1/AppData/Roaming/Adobe/CEP/extensions/', 'Z:/', NULL, 'prod'),
('Render 2', 'win', 'Render2', 'G:/My Drive/', 'Q:/', 'C:/Users/Render2/AppData/Roaming/Adobe/CEP/extensions/', 'Z:/', NULL, 'prod');

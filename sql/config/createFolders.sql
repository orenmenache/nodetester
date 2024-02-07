DROP TABLE IF EXISTS config.folders;
CREATE TABLE config.folders (
    name VARCHAR(255) PRIMARY KEY,
    relative_path VARCHAR(255) NOT NULL,
    root_folder VARCHAR(255) NOT NULL
);

INSERT INTO config.folders (name, relative_path, root_folder) VALUES
('narration', 'Sports/S_Studio/S_S_Narration/S_S_N_Mixed/', 'drive_path'),
('backgrounds', 'Sports/S_Studio/S_S_Backgrounds/', 'drive_path'),
('logos', 'Sports/S_Studio/S_S_Logos/', 'drive_path'),
('exports', 'Sports/S_Studio/mixed edition test export/', 'drive_path'),
('projects', 'Studio/Sports/S_Victor Projects/S_V_AE Projects/General sports reduced folder collected/', 'qnap_path'),
('projsaves', 'Sports/S_Studio/mixed edition test save/', 'drive_path');

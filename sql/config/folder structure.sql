-- Here we'll define the general folder structure
-- for every brand and product.
-- the structure assumes that products are stored in a client folder

DROP TABLE IF EXISTS config.product_folders;
DROP TABLE IF EXISTS config.brand_products; -- every brand can have several products
DROP TABLE IF EXISTS config.products;
DROP TABLE IF EXISTS config.brands;
DROP TABLE IF EXISTS config.general_folders;
DROP TABLE IF EXISTS config.folder_types; -- for example: saves, exports, templates

CREATE TABLE config.folder_types (
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- not every product will have every folder type
INSERT INTO config.folder_types (name) VALUES 
('saves'), 
('exports'), 
('templates'), 
('staticBackgrounds'), 
('dynamicBackgrounds'), 
('logos'), 
('narration');

-- here we define the general folder paths
-- the ones that are not brand or product specific
CREATE TABLE config.general_folders (
    name VARCHAR(255) PRIMARY KEY,
    folder_type VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255) NOT NULL,
    root_folder VARCHAR(255) NOT NULL CHECK (root_folder IN ('drive_path', 'qnap_path', 'local_storage_path')) -- must be one of "drive_path", "qnap_path", "local_storage_path"
    PRIMARY KEY (name),
    FOREIGN KEY (folder_type) REFERENCES config.folder_types(name)
);

INSERT INTO config.general_folders (name, folder_path, root_folder) VALUES
('narration', 'Sports/S_Studio/S_S_Narration/S_S_N_Mixed/', 'drive_path'),
('staticBackgrounds', 'Sports/S_Studio/S_S_Backgrounds/S_S_B_Static/', 'drive_path'),
('dynamicBackgrounds', 'Sports/S_Studio/S_S_Backgrounds/S_S_B_Dynamic/', 'drive_path'),
('logos', 'Sports/S_Studio/S_S_Logos/', 'drive_path');

CREATE TABLE config.brands (
    name VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255) NOT NULL,
    root_folder VARCHAR(255) NOT NULL CHECK (root_folder IN ('drive_path', 'qnap_path', 'local_storage_path')),
    PRIMARY KEY (name)
);

-- folder paths are dynamic, expecting a root_path
INSERT INTO config.brands (name, folder_path, root_folder) VALUES 
('Wolf777', 'Studio/Sports/Wolf777/', 'qnap_path'), 
('CWINZ', 'Studio/Sports/CWINZ/', 'qnap_path');

CREATE TABLE config.products (
    name VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255) NOT NULL,
    PRIMARY KEY (name)
);

INSERT INTO config.products (name, folder_path) VALUES 
('AE_Daily_News', '$client_path/AE/'),
('SNS_AE_Insta', '$client_path/SNS/insta/'),
('SNS_PS_Schedule', '$client_path/SNS/PS/schedule/'),
('SNS_PS_News', '$client_path/SNS/PS/news/'),
('SNS_PS_Ranking', '$client_path/SNS/PS/ranking/');
('SNS_PS_Scores', '$client_path/SNS/PS/scores/');

CREATE TABLE config.brand_products (
    brand_name INT NOT NULL,
    product_name INT NOT NULL,
    FOREIGN KEY (brand_name) REFERENCES config.brands(name),
    FOREIGN KEY (product_name) REFERENCES config.products(name),
    PRIMARY KEY (brand_name, product_name)
);

-- Let's give every brand every product
INSERT INTO config.brand_products (brand_name, product_name) VALUES 
('Wolf777', 'AE_Daily_News'),
('Wolf777', 'SNS_AE_Insta'),
('Wolf777', 'SNS_PS_Schedule'),
('Wolf777', 'SNS_PS_News'),
('Wolf777', 'SNS_PS_Ranking'),
('Wolf777', 'SNS_PS_Scores'),
('CWINZ', 'AE_Daily_News'),
('CWINZ', 'SNS_AE_Insta'),
('CWINZ', 'SNS_PS_Schedule'),
('CWINZ', 'SNS_PS_News'),
('CWINZ', 'SNS_PS_Ranking'),
('CWINZ', 'SNS_PS_Scores');

CREATE TABLE config.product_folders (
    product_name VARCHAR(50) NOT NULL,
    folder_type VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (folder_type) REFERENCES config.folder_types(name),
    FOREIGN KEY (product_name) REFERENCES config.products(name),
    PRIMARY KEY (product_name, folder_type)
);

-- the following paths will be dynamic,
-- expecting either $client_path / $qnap_path / $drive_path
-- or the generic $narration_path / $dynamicBackgrounds_path / $logos_path / $staticBackgrounds_path
-- in the case of AE products we define narration and dynamicBackgrounds
-- in the case of PSV products we define logos and staticBackgrounds

INSERT INTO config.product_folders (product_name, folder_type, folder_path) VALUES 
('AE_Daily_News', 'saves', '$client_path/AE/Daily News/saves/'),
('AE_Daily_News', 'exports', '$client_path/AE/Daily News/exports/'),
('AE_Daily_News', 'templates', '$client_path/AE/Daily News/templates/'),

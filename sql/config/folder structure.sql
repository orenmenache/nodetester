-- Here we'll define the general folder structure
-- for every brand and product.
-- the structure assumes that products are stored in a brand folder

DROP TABLE IF EXISTS config.CORE_L3_editions;
DROP TABLE IF EXISTS config.CORE_L3_product_subfolders;
DROP TABLE IF EXISTS config.CORE_L2_brands;
DROP TABLE IF EXISTS config.CORE_L2_folder_types;
DROP TABLE IF EXISTS config.CORE_L1_products;
DROP TABLE IF EXISTS config.CORE_L1_scopes;
DROP TABLE IF EXISTS config.CORE_L1_root_folders;
DROP TABLE IF EXISTS config.CORE_L1_langs;
DROP TABLE IF EXISTS config.CORE_L1_sports;

CREATE TABLE config.CORE_L1_sports (
    id INT NOT NULL, -- the id as appears in allSportsAPI
    name VARCHAR(10) NOT NULL,
    short_name VARCHAR(2) NOT NULL,
    PRIMARY KEY (name)
);

INSERT INTO config.CORE_L1_sports (id, name, short_name) VALUES 
(62, 'Cricket', 'CK'),
(1, 'Football', 'FB'),
(5, 'Tennis', 'TN'),
(777, 'General', 'GE'),
(2, 'Basketball', 'BB'),
(11, 'Motorsport', 'MS');

CREATE TABLE config.CORE_L1_langs (
    lang VARCHAR(5) NOT NULL,
    PRIMARY KEY (lang)
);

INSERT INTO config.CORE_L1_langs (lang) VALUES 
('EN'),
('HI');

CREATE TABLE config.CORE_L1_root_folders (
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (name)
);

INSERT INTO config.CORE_L1_root_folders (name) VALUES 
('drive_path'),
('qnap_path'),
('local_storage_path');

CREATE TABLE config.CORE_L1_scopes (
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (name)
);

INSERT INTO config.CORE_L1_scopes (name) VALUES 
('general'),
('product specific'),
('brand specific');

CREATE TABLE config.CORE_L1_products (
    product_name VARCHAR(50) NOT NULL,
    product_path VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_name)
);

INSERT INTO config.CORE_L1_products (product_name, product_path) VALUES 
('AE_Daily_News', '$brand_path/AE/Daily News/'),
('SNS_AE_News', '$brand_path/SNS/AE/News/'),
('SNS_AE_Tech', '$brand_path/SNS/AE/Tech/'),
('SNS_PS_Schedule', '$brand_path/SNS/PS/Schedule/'),
('SNS_PS_News', '$brand_path/SNS/PS/News/'),
('SNS_PS_Scores', '$brand_path/SNS/PS/Scores/'),
('SNS_PS_Ranking', '$brand_path/SNS/PS/Ranking/');

CREATE TABLE config.CORE_L2_folder_types (
    name VARCHAR(50) NOT NULL,
    scope VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255),
    root_folder VARCHAR(255),
    PRIMARY KEY (name),
    FOREIGN KEY (scope) REFERENCES config.CORE_L1_scopes(name),
    FOREIGN KEY (root_folder) REFERENCES config.CORE_L1_root_folders(name)
);

-- not every product will have every folder type
INSERT INTO config.CORE_L2_folder_types (name, scope, folder_path, root_folder) VALUES 
('saves', 'product specific', NULL, NULL),
('exports', 'product specific', NULL, NULL),
('templates', 'product specific', NULL, NULL), 
('staticBackgrounds', 'general', 'Sports/S_Studio/S_S_Backgrounds/S_S_B_Static/', 'drive_path'), 
('dynamicBackgrounds', 'general', 'Sports/S_Studio/S_S_Backgrounds/S_S_B_Dynamic/', 'drive_path'), 
('logos', 'general', 'Sports/S_Studio/S_S_Logos/', 'drive_path'), 
('narration', 'general', 'Sports/S_Studio/S_S_Narration/S_S_N_Mixed/', 'drive_path'),
('presenters', 'brand specific', NULL, NULL);

CREATE TABLE config.CORE_L2_brands (
    brand_name VARCHAR(50) NOT NULL,
    brand_path VARCHAR(255) NOT NULL,
    root_folder VARCHAR(255) NOT NULL,
    FOREIGN KEY (root_folder) REFERENCES config.CORE_L1_root_folders(name),
    PRIMARY KEY (brand_name)
);

-- folder paths are dynamic, expecting a root_path
INSERT INTO config.CORE_L2_brands (brand_name, brand_path, root_folder) VALUES 
('Wolf777', 'Studio/Sports/S_Brands/Wolf777/', 'qnap_path'), 
('CWINZ', 'Studio/Sports/S_Brands/CWINZ/', 'qnap_path');

CREATE TABLE config.CORE_L3_product_subfolders (
    product_name VARCHAR(50) NOT NULL,
    folder_type VARCHAR(50) NOT NULL,
    subfolder_path VARCHAR(255) NOT NULL,
    expected_variables VARCHAR(255) , -- one or more of $sport, $lang, $brand_path, $product_path comma separated
    FOREIGN KEY (folder_type) REFERENCES config.CORE_L2_folder_types(name),
    FOREIGN KEY (product_name) REFERENCES config.CORE_L1_products(product_name),
    PRIMARY KEY (product_name, folder_type)
);

-- the following paths will be dynamic,
-- expecting either $product_path / $qnap_path / $drive_path

-- Note: we're using $product_path and not $brand_path since 
-- the product general path has been defined in the products table
-- and it is built upon the brand path

-- or the generic $narration_path / $dynamicBackgrounds_path / $logos_path / $staticBackgrounds_path
-- in the case of AE products we define narration and dynamicBackgrounds
-- in the case of PS products we define logos and staticBackgrounds

INSERT INTO config.CORE_L3_product_subfolders (product_name, folder_type, subfolder_path, expected_variables) VALUES 
('AE_Daily_News', 'saves', '$product_path/saves/', '$product_path'),
('AE_Daily_News', 'exports', '$product_path/exports/', '$product_path'),
('AE_Daily_News', 'templates', '$product_path/templates/', '$product_path'),
('AE_Daily_News', 'dynamicBackgrounds', '$general_path/', '$general_path'),
('AE_Daily_News', 'presenters', '$brand_path/presenters/$lang/', '$brand_path, $lang'),
('AE_Daily_News', 'narration', '$general_path/$sport/$lang/', '$general_path, $sport, $lang'),
('SNS_AE_News', 'saves', '$product_path/saves/', '$product_path'),
('SNS_AE_News', 'exports', '$product_path/exports/', '$product_path'),
('SNS_AE_News', 'templates', '$product_path/templates/', '$product_path'),
('SNS_AE_News', 'dynamicBackgrounds', '$general_path/', '$general_path'),
('SNS_AE_News', 'presenters', '$brand_path/presenters/$lang/', '$brand_path, $lang'),
('SNS_AE_News', 'narration', '$general_path/$sport/$lang/', '$general_path, $sport, $lang'),
('SNS_AE_Tech', 'saves', '$product_path/saves/', '$product_path'),
('SNS_AE_Tech', 'exports', '$product_path/exports/', '$product_path'),
('SNS_AE_Tech', 'templates', '$product_path/templates/', '$product_path'),
('SNS_AE_Tech', 'dynamicBackgrounds', '$general_path/', '$general_path'),
('SNS_AE_Tech', 'narration', '$general_path/$sport/$lang/', '$general_path, $sport, $lang'),
('SNS_PS_Schedule', 'saves', '$product_path/saves/', '$product_path'),
('SNS_PS_Schedule', 'exports', '$product_path/exports/', '$product_path'),
('SNS_PS_Schedule', 'templates', '$product_path/templates/', '$product_path'),
('SNS_PS_Schedule', 'staticBackgrounds', '$general_path/', '$general_path'),
('SNS_PS_Schedule', 'logos', '$general_path/$sport/', '$general_path, $sport'),
('SNS_PS_News', 'saves', '$product_path/saves/', '$product_path'),
('SNS_PS_News', 'exports', '$product_path/exports/', '$product_path'),
('SNS_PS_News', 'templates', '$product_path/templates/', '$product_path'),
('SNS_PS_News', 'staticBackgrounds', '$general_path/', '$general_path'),
('SNS_PS_News', 'logos', '$general_path/$sport/', '$general_path, $sport'),
('SNS_PS_Scores', 'saves', '$product_path/saves/', '$product_path'),
('SNS_PS_Scores', 'exports', '$product_path/exports/', '$product_path'),
('SNS_PS_Scores', 'templates', '$product_path/templates/', '$product_path'),
('SNS_PS_Scores', 'staticBackgrounds', '$general_path', '$general_path'),
('SNS_PS_Scores', 'logos', '$general_path/$sport/', '$general_path, $sport'),
('SNS_PS_Ranking', 'saves', '$product_path/saves/', '$product_path'),
('SNS_PS_Ranking', 'exports', '$product_path/exports/', '$product_path'),
('SNS_PS_Ranking', 'templates', '$product_path/templates/', '$product_path'),
('SNS_PS_Ranking', 'staticBackgrounds', '$general_path/$sport/', '$general_path, $sport'),
('SNS_PS_Ranking', 'logos', '$general_path/$sport/', '$general_path, $sport');

-- here we assign a product and language to a brand
CREATE TABLE config.CORE_L3_editions (
    brand_name VARCHAR(50) NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    lang VARCHAR(255) NOT NULL,
    sport VARCHAR(255) NOT NULL,
    FOREIGN KEY (brand_name) REFERENCES config.CORE_L2_brands(brand_name),
    FOREIGN KEY (product_name) REFERENCES config.CORE_L1_products(product_name),
    FOREIGN KEY (lang) REFERENCES config.CORE_L1_langs(lang),
    FOREIGN KEY (sport) REFERENCES config.CORE_L1_sports(name),
    PRIMARY KEY (brand_name, product_name, lang)
);

INSERT INTO config.CORE_L3_editions (brand_name, product_name, lang, sport) VALUES 
('CWINZ', 'AE_Daily_News', 'HI', 'Cricket'),
('CWINZ', 'SNS_AE_News', 'HI', 'General'),
('Wolf777', 'AE_Daily_News', 'HI', 'Cricket'),
('Wolf777', 'SNS_PS_Ranking', 'HI', 'Cricket');


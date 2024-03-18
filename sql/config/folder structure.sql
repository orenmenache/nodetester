-- Here we'll define the general folder structure
-- for every brand and product.
-- the structure assumes that products are stored in a brand folder

DROP TABLE IF EXISTS config.CORE_L2_product_subfolders;
DROP TABLE IF EXISTS config.CORE_L2_brands;
DROP TABLE IF EXISTS config.CORE_L2_folder_types;
DROP TABLE IF EXISTS config.CORE_L1_products;
DROP TABLE IF EXISTS config.CORE_L1_scopes;
DROP TABLE IF EXISTS config.CORE_L1_root_folders;

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
    folder_path VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_name)
);

INSERT INTO config.CORE_L1_products (product_name, folder_path) VALUES 
('AE_Daily_News', '$brand_path/AE/Daily News/'),
('SNS_AE_News', '$brand_path/SNS/AE/News/'),
('SNS_AE_Tech', '$brand_path/SNS/AE/Tech/'),
('SNS_PS_Schedule', '$brand_path/SNS/PS/Schedule/'),
('SNS_PS_News', '$brand_path/SNS/PS/News/'),
('SNS_PS_Scores', '$brand_path/SNS/PS/Scores/');
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
    folder_path VARCHAR(255) NOT NULL,
    root_folder VARCHAR(255) NOT NULL,
    FOREIGN KEY (root_folder) REFERENCES config.CORE_L1_root_folders(name),
    PRIMARY KEY (brand_name)
);

-- folder paths are dynamic, expecting a root_path
INSERT INTO config.CORE_L2_brands (brand_name, folder_path, root_folder) VALUES 
('Wolf777', 'Studio/Sports/S_Brands/Wolf777/', 'qnap_path'), 
('CWINZ', 'Studio/Sports/S_Brands/CWINZ/', 'qnap_path');

CREATE TABLE config.CORE_L2_product_subfolders (
    product_name VARCHAR(50) NOT NULL,
    folder_type VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (folder_type) REFERENCES config.CORE_L1_folder_types(name),
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

INSERT INTO config.CORE_L2_product_subfolders (product_name, folder_type, folder_path) VALUES 
('AE_Daily_News', 'saves', '$product_path/saves/'),
('AE_Daily_News', 'exports', '$product_path/exports/'),
('AE_Daily_News', 'templates', '$product_path/templates/'),
('AE_Daily_News', 'dynamicBackgrounds', '$general_path/'),
('AE_Daily_News', 'presenters', '$brand_path/presenters/$lang/'),
('AE_Daily_News', 'narration', '$general_path/$sport/$lang/'),
('SNS_AE_News', 'saves', '$product_path/saves/'),
('SNS_AE_News', 'exports', '$product_path/exports/'),
('SNS_AE_News', 'templates', '$product_path/templates/'),
('SNS_AE_News', 'dynamicBackgrounds', '$general_path/'),
('SNS_AE_News', 'presenters', '$brand_path/presenters/$lang/'),
('SNS_AE_News', 'narration', '$general_path/$sport/$lang/'),
('SNS_AE_Tech', 'saves', '$product_path/saves/'),
('SNS_AE_Tech', 'exports', '$product_path/exports/'),
('SNS_AE_Tech', 'templates', '$product_path/templates/'),
('SNS_AE_Tech', 'dynamicBackgrounds', '$general_path/'),
('SNS_AE_Tech', 'narration', '$general_path/$sport/$lang/'),
('SNS_PS_Schedule', 'saves', '$product_path/saves/'),
('SNS_PS_Schedule', 'exports', '$product_path/exports/'),
('SNS_PS_Schedule', 'templates', '$product_path/templates/'),
('SNS_PS_Schedule', 'staticBackgrounds', '$general_path/'),
('SNS_PS_Schedule', 'logos', '$general_path/$sport/'),
('SNS_PS_News', 'saves', '$product_path/saves/'),
('SNS_PS_News', 'exports', '$product_path/exports/'),
('SNS_PS_News', 'templates', '$product_path/templates/'),
('SNS_PS_News', 'staticBackgrounds', '$general_path/'),
('SNS_PS_News', 'logos', '$general_path/$sport/'),
('SNS_PS_Scores', 'saves', '$product_path/saves/'),
('SNS_PS_Scores', 'exports', '$product_path/exports/'),
('SNS_PS_Scores', 'templates', '$product_path/templates/'),
('SNS_PS_Scores', 'staticBackgrounds', '$general_path'),
('SNS_PS_Scores', 'logos', '$general_path/$sport/'),
('SNS_PS_Ranking', 'saves', '$product_path/saves/'),
('SNS_PS_Ranking', 'exports', '$product_path/exports/'),
('SNS_PS_Ranking', 'templates', '$product_path/templates/'),
('SNS_PS_Ranking', 'staticBackgrounds', '$general_path/$sport/'),
('SNS_PS_Ranking', 'logos', '$general_path/$sport/');

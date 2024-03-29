"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
The following is the sql statement used to insert the 5 tables mentioned above:

-- Here we'll define the general folder structure
-- for every brand and product.
-- the structure assumes that products are stored in a brand folder

DROP TABLE IF EXISTS config.CORE__product_subfolders;
DROP TABLE IF EXISTS config.CORE__brand_products; -- every brand can have several products
DROP TABLE IF EXISTS config.CORE__products;
DROP TABLE IF EXISTS config.CORE__brands;
DROP TABLE IF EXISTS config.CORE__general_folders;
DROP TABLE IF EXISTS config.CORE__folder_types; -- for example: saves, exports, templates
DROP TABLE IF EXISTS config.CORE__scopes;
DROP TABLE IF EXISTS config.CORE__root_folders;

CREATE TABLE config.CORE__root_folders (
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (name)
);

INSERT INTO config.CORE__root_folders (name) VALUES
('drive_path'),
('qnap_path'),
('local_storage_path');

CREATE TABLE config.CORE__scopes (
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (name)
);

INSERT INTO config.CORE__scopes (name) VALUES
('general'),
('product specific'),
('brand specific');

CREATE TABLE config.CORE__folder_types (
    name VARCHAR(50) NOT NULL,
    scope VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255),
    root_folder VARCHAR(255),
    PRIMARY KEY (name),
    FOREIGN KEY (scope) REFERENCES config.CORE__scopes(name),
    FOREIGN KEY (root_folder) REFERENCES config.CORE__root_folders(name)
);

-- not every product will have every folder type
INSERT INTO config.CORE__folder_types (name, scope, folder_path, root_folder) VALUES
('saves', 'product specific', NULL, NULL),
('exports', 'product specific', NULL, NULL),
('templates', 'product specific', NULL, NULL),
('staticBackgrounds', 'general', 'Sports/S_Studio/S_S_Backgrounds/S_S_B_Static/', 'drive_path'),
('dynamicBackgrounds', 'general', 'Sports/S_Studio/S_S_Backgrounds/S_S_B_Dynamic/', 'drive_path'),
('logos', 'general', 'Sports/S_Studio/S_S_Logos/', 'drive_path'),
('narration', 'general', 'Sports/S_Studio/S_S_Narration/S_S_N_Mixed/', 'drive_path'),
('presenters', 'brand specific', NULL, NULL);

-- was going to define the general folders here,
-- but since they are at a ratio of 1 to 1 with the folder types
-- there's no need

-- CREATE TABLE config.CORE__general_folders (
--     name VARCHAR(255),
--     folder_type VARCHAR(50) NOT NULL,
--     folder_path VARCHAR(255) NOT NULL,
--     root_folder VARCHAR(255) NOT NULL CHECK (root_folder IN ('drive_path', 'qnap_path', 'local_storage_path')), -- must be one of "drive_path", "qnap_path", "local_storage_path"
--     PRIMARY KEY (name),
--     FOREIGN KEY (folder_type) REFERENCES config.CORE__folder_types(name)
-- );

-- INSERT INTO config.CORE__general_folders (name, folder_type, folder_path, root_folder) VALUES
-- ('narration', 'narration', 'Sports/S_Studio/S_S_Narration/S_S_N_Mixed/', 'drive_path'),
-- ('staticBackgrounds', 'staticBackgrounds', 'Sports/S_Studio/S_S_Backgrounds/S_S_B_Static/', 'drive_path'),
-- ('dynamicBackgrounds', 'dynamicBackgrounds', 'Sports/S_Studio/S_S_Backgrounds/S_S_B_Dynamic/', 'drive_path'),
-- ('logos', 'logos', 'Sports/S_Studio/S_S_Logos/', 'drive_path');

CREATE TABLE config.CORE__brands (
    brand_name VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255) NOT NULL,
    root_folder VARCHAR(255) NOT NULL CHECK (root_folder IN ('drive_path', 'qnap_path', 'local_storage_path')),
    PRIMARY KEY (brand_name)
);

-- folder paths are dynamic, expecting a root_path
INSERT INTO config.CORE__brands (brand_name, folder_path, root_folder) VALUES
('Wolf777', 'Studio/Sports/S_Brands/Wolf777/', 'qnap_path'),
('CWINZ', 'Studio/Sports/S_Brands/CWINZ/', 'qnap_path');

CREATE TABLE config.CORE__products (
    product_name VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_name)
);

INSERT INTO config.CORE__products (product_name, folder_path) VALUES
('AE_Daily_News', '$brand_path/AE/Daily News/'),
('SNS_AE_Insta', '$brand_path/SNS/insta/'),
('SNS_PS_Schedule', '$brand_path/SNS/PS/schedule/'),
('SNS_PS_News', '$brand_path/SNS/PS/news/'),
('SNS_PS_Ranking', '$brand_path/SNS/PS/ranking/'),
('SNS_PS_Scores', '$brand_path/SNS/PS/scores/');

CREATE TABLE config.CORE__brand_products (
    brand_name VARCHAR(50) NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (brand_name) REFERENCES config.CORE__brands(brand_name),
    FOREIGN KEY (product_name) REFERENCES config.CORE__products(product_name),
    PRIMARY KEY (brand_name, product_name)
);

-- Let's give every brand every product
INSERT INTO config.CORE__brand_products (brand_name, product_name) VALUES
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

CREATE TABLE config.CORE__product_subfolders (
    product_name VARCHAR(50) NOT NULL,
    folder_type VARCHAR(50) NOT NULL,
    folder_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (folder_type) REFERENCES config.CORE__folder_types(name),
    FOREIGN KEY (product_name) REFERENCES config.CORE__products(product_name),
    PRIMARY KEY (product_name, folder_type)
);

-- the following paths will be dynamic,
-- expecting either $product_path / $qnap_path / $drive_path

-- Note: we're using $product_path and not $brand_path since
-- the product general path has been defined in the products table
-- and it is built upon the brand path

-- or the generic $narration_path / $dynamicBackgrounds_path / $logos_path / $staticBackgrounds_path
-- in the case of AE products we define narration and dynamicBackgrounds
-- in the case of PSV products we define logos and staticBackgrounds

INSERT INTO config.CORE__product_subfolders (product_name, folder_type, folder_path) VALUES
('AE_Daily_News', 'saves', '$product_path/saves/'),
('AE_Daily_News', 'exports', '$product_path/exports/'),
('AE_Daily_News', 'templates', '$product_path/templates/'),
('AE_Daily_News', 'dynamicBackgrounds', '$general_path'),
('AE_Daily_News', 'presenters', '$brand_path/presenters/$lang/'),
('AE_Daily_News', 'narration', '$general_path/$lang/');

*/

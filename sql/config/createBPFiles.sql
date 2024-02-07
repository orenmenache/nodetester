-- can only be created after the blueprints table is created
-- Here we'll be making the AE.Json.FileImport + extras to make DB.FileImport

DROP TABLE IF EXISTS config.BP__files;
CREATE TABLE config.BP__files (
    blueprint_name VARCHAR(255) NOT NULL,
    -- the following 3 fields will be used to get the file path
    source_table_name VARCHAR(255) NOT NULL,
    source_column_name VARCHAR(255) NOT NULL,
    source_row_formula VARCHAR(255) NOT NULL,

    composition_name VARCHAR(255) NOT NULL,
    resize_action VARCHAR(255),
    FOREIGN KEY (blueprint_name) REFERENCES config.bluePrints(name)
);
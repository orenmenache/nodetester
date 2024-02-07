-- can only be created after the blueprints table is created
-- Here we'll be making the AE.Json.TextImport + extras to make DB.TextImport

DROP TABLE IF EXISTS config.BP__texts;
CREATE TABLE config.BP__texts (
    blueprint_name VARCHAR(255) NOT NULL,
    -- the following 3 fields will be used to create the source text
    source_table_name VARCHAR(255) NOT NULL,
    source_column_name VARCHAR(255) NOT NULL,
    source_row_formula VARCHAR(255) NOT NULL,

    text_layer_name VARCHAR(255) NOT NULL,
    recursive_insertion BOOLEAN NOT NULL,
    required BOOLEAN NOT NULL, -- state if conditional if we want the procedure to continue even if this text doesn't exist
    FOREIGN KEY (blueprint_name) REFERENCES config.bluePrints(name)
);
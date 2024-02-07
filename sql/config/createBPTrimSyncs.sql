-- can only be created after the blueprints table is created
-- Here we'll be making the AE.Json.TS.Sequence + extras to make DB.TS.Sequence
-- will have to be validated by the method type and method name

DROP TABLE IF EXISTS config.BP__ts_sequence;
CREATE TABLE config.BP__ts_sequence (
    blueprint_name VARCHAR(255) NOT NULL,
    method_type VARCHAR(255) NOT NULL, -- 'trim' or 'sync' or 'marker'
    method_name VARCHAR(255) NOT NULL, -- 'trimByAudio' or 'trimByVideo' etc
    order_of_execution INT NOT NULL, -- 1 will come before 2 obviously

    -- for trim
    threshold INT,
    pad_in INT,
    pad_out INT,
    layer_or_comp_name VARCHAR(255),
    trim_to_layer VARCHAR(255),
    time INT,

    -- for sync / marker
    padding INT,
    layer_a_name VARCHAR(255),
    layer_b_name VARCHAR(255),

    FOREIGN KEY (blueprint_name) REFERENCES config.bluePrints(name)
);
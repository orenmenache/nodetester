USE config;
DROP TABLE IF EXISTS CORE_L2_product_layer_scheme;
CREATE TABLE CORE_L2_product_layer_scheme (
    scheme_name VARCHAR(50) NOT NULL, -- one product can have multiple schemes
    product_name VARCHAR(50) NOT NULL,
    item_text_keys VARCHAR(255) NOT NULL, -- a comma separated list of keys
    item_text_layers VARCHAR(255) NOT NULL, -- a comma separated list of layers
    item_file_keys VARCHAR(255) NOT NULL, -- a comma separated list of keys
    item_file_layers VARCHAR(255) NOT NULL, -- a comma separated list of layers
    item_comp_structure VARCHAR(50) NOT NULL, -- Example: "3,2" means 3 items in first comp and 2 in second
    FOREIGN KEY (product_name) REFERENCES CORE_L1_products(product_name),
    PRIMARY KEY (scheme_name, product_name)
);

DROP TABLE IF EXISTS CORE_L3_AE_comp_objects;
CREATE TABLE CORE_L3_AE_comp_objects (
    product_name VARCHAR(50) NOT NULL,
    comp_object_name VARCHAR(50) NOT NULL, -- Example: "News item" -- This is internal as it is NOT the comp's name
    comp_name_structure VARCHAR(50) NOT NULL, -- Example: "News Comp $item_num" -- This means the comp name is "News Comp 1" or "News Comp 2" etc.
    
    text_keys VARCHAR(255) NOT NULL, -- a comma separated list of keys
    text_layers VARCHAR(255) NOT NULL, -- a comma separated list of layers
    file_keys VARCHAR(255) NOT NULL, -- a comma separated list of keys
    file_layers VARCHAR(255) NOT NULL, -- a comma separated list of layers
    
    has_comp_objects BOOLEAN NOT NULL, -- If this comp has comp objects
    comp_objects VARCHAR(255), -- a comma separated list of comp objects, NULL means there are none
    
    FOREIGN KEY (product_name) REFERENCES CORE_L1_products(product_name),
    PRIMARY KEY (comp_object_name, product_name)
);
-- step 1
-- get all the tables that have a foreign key 
-- constraint on CORE_L1_sports.name

SELECT 
    tc.table_schema, 
    tc.table_name, 
    kcu.column_name, 
    rc.constraint_schema AS foreign_table_schema,
    rc.table_name AS foreign_table_name,
    kcu.referenced_column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND rc.referenced_table_name = 'CORE_L1_sports' 
  AND kcu.referenced_column_name = 'name';

-- step 2
-- get the names of the constraints

SELECT 
    table_name, 
    constraint_name 
FROM 
    information_schema.key_column_usage 
WHERE 
    referenced_table_name = 'CORE_L1_sports' 
    AND referenced_column_name = 'name';

-- step 3: Drop Foreign Key Constraints
ALTER TABLE config.CORE_L3_editions
DROP FOREIGN KEY CORE_L3_editions_ibfk_4;

ALTER TABLE config.lambdas
DROP FOREIGN KEY lambdas_ibfk_1;

ALTER TABLE config.CORE_L2_search_phrases
DROP FOREIGN KEY CORE_L2_search_phrases_ibfk_1;

ALTER TABLE config.CORE_L2_providers
DROP FOREIGN KEY CORE_L2_providers_ibfk_1;

ALTER TABLE config.CORE_L2_GD_folder_ids
DROP FOREIGN KEY CORE_L2_GD_folder_ids_ibfk_1;

-- Step 4: Modify the Column in the Main Table
ALTER TABLE config.CORE_L1_sports
MODIFY COLUMN name VARCHAR(40);

-- Step 5: Update Dependent Columns
ALTER TABLE config.CORE_L3_editions
MODIFY COLUMN sport VARCHAR(40);

ALTER TABLE config.lambdas
MODIFY COLUMN sport VARCHAR(40);

ALTER TABLE config.CORE_L2_search_phrases
MODIFY COLUMN sport_name VARCHAR(40);

ALTER TABLE config.CORE_L2_providers
MODIFY COLUMN sport_name VARCHAR(40);

ALTER TABLE config.CORE_L2_GD_folder_ids
MODIFY COLUMN sport_name VARCHAR(40);

-- Step 6: Recreate Foreign Key Constraints
ALTER TABLE config.CORE_L3_editions
ADD CONSTRAINT CORE_L3_editions_ibfk_4
FOREIGN KEY (sport) REFERENCES config.CORE_L1_sports(name);

ALTER TABLE config.lambdas
ADD CONSTRAINT lambdas_ibfk_1
FOREIGN KEY (sport) REFERENCES config.CORE_L1_sports(name);

ALTER TABLE config.CORE_L2_search_phrases
ADD CONSTRAINT CORE_L2_search_phrases_ibfk_1
FOREIGN KEY (sport_name) REFERENCES config.CORE_L1_sports(name);

ALTER TABLE config.CORE_L2_providers
ADD CONSTRAINT CORE_L2_providers_ibfk_1
FOREIGN KEY (sport_name) REFERENCES config.CORE_L1_sports(name);

ALTER TABLE config.CORE_L2_GD_folder_ids
ADD CONSTRAINT CORE_L2_GD_folder_ids_ibfk_1
FOREIGN KEY (sport_name) REFERENCES config.CORE_L1_sports(name);
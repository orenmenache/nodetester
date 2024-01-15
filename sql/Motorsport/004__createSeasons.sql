DROP TABLE IF EXISTS Motorsport.CORE__SEASONS;
CREATE TABLE Motorsport.CORE__SEASONS (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES CORE__CATEGORIES(id),
    stage_id INT NOT NULL,
    FOREIGN KEY (stage_id) REFERENCES CORE__STAGES(id),
    description TEXT,
    year INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL
);
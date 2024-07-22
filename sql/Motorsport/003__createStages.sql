DROP TABLE IF EXISTS Motorsport.CORE__STAGES;
CREATE TABLE Motorsport.CORE__STAGES (
    id INT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    category_slug VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Motorsport.CORE__CATEGORIES(id)
);
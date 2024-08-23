USE dbName;
DROP TABLE IF EXISTS AZURE_RAPID_L1_news;
CREATE TABLE AZURE_RAPID_L1_news
(
    name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    provider VARCHAR(255) NOT NULL,
    search_phrase VARCHAR(255) NOT NULL,
    date_published TIMESTAMP NOT NULL,
    when_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
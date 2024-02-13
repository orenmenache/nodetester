DROP TABLE IF EXISTS config.presenterColors;
CREATE TABLE config.presenterColors (
    name VARCHAR(255) PRIMARY KEY
);

DROP TABLE IF EXISTS config.presenterSchemes;
CREATE TABLE config.presenterSchemes (
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL, -- 'weekly', 'monthly'
    day VARCHAR(255) NOT NULL, -- Either a weekday name or a number for the day of the month
    color VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    PRIMARY KEY (name, day),
    FOREIGN KEY (color) REFERENCES config.presenterColors(name)
);

INSERT INTO config.presenterColors (name) VALUES
('red'),
('blue'),
('green'),
('yellow'),
('purple'),
('orange'),
('pink'),
('black'),
('white'),
('grey'),
('beige');

INSERT INTO config.presenterSchemes (name, type, day, color, gender) VALUES
('general_news_weekly_default', 'weekly', 'monday', 'red', 'male'),
('general_news_weekly_default', 'weekly', 'tuesday', 'black', 'male'),
('general_news_weekly_default', 'weekly', 'wednesday', 'beige', 'male'),
('general_news_weekly_default', 'weekly', 'thursday', 'red', 'male'),
('general_news_weekly_default', 'weekly', 'friday', 'black', 'male'),
('general_news_weekly_default', 'weekly', 'saturday', 'beige', 'male'),
('general_news_weekly_default', 'weekly', 'sunday', 'black', 'male');
USE config;
DROP TABLE IF EXISTS lambdas;
CREATE TABLE lambdas (
    name VARCHAR(255) PRIMARY KEY,
    description VARCHAR(900),
    stage INT,
    cron VARCHAR(255),
    env_keys VARCHAR(900),
    when_created TIMESTAMP,
    last_run TIMESTAMP,
    last_error TEXT
);
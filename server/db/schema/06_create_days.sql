-- schema/06_create_days.sql
DROP TABLE IF EXISTS days CASCADE;
-- CREATE DAYS
CREATE TABLE days (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
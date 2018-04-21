CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name varchar(254),
	email varchar(254) UNIQUE NOT NULL,
	password text NOT NULL,
	registered TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
	verified boolean DEFAULT 'false'
);

INSERT INTO users (name, email, password) VALUES
  ('Test name', 'test@example.com', 'should_be_hash');


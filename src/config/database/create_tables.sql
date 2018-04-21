-- Users
CREATE TABLE IF NOT EXISTS users (
	id serial PRIMARY KEY,
	name varchar(254),
	email varchar(254) UNIQUE NOT NULL,
	password text NOT NULL,
	registered TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
	verified boolean DEFAULT 'false',
	admin boolean DEFAULT 'false'
);

-- User verification
CREATE TABLE IF NOT EXISTS user_verification (
	user_id serial REFERENCES users (id) ON DELETE CASCADE,
	code text NOT NULL,
	created TIMESTAMPTZ DEFAULT current_timestamp,
	PRIMARY KEY (user_id)
);

-- Sources
CREATE TABLE IF NOT EXISTS sources (
	id serial PRIMARY KEY,
	name varchar(32) NOT NULL,
	description varchar(64),
	slug varchar(32) NOT NULL,
	homepage varchar(254) NOT NULL,
	url varchar(254) UNIQUE NOT NULL,
	image varchar(254),
	language varchar(2) DEFAULT 'en',
	country varchar(12),
	category varchar(32) NOT NULL
);

-- Source status
CREATE TABLE IF NOT EXISTS source_status (
	source_id smallint REFERENCES sources (id) ON DELETE CASCADE,
	period smallint NOT NULL DEFAULT 1440,
	active boolean DEFAULT 'true',
	last_fetch TIMESTAMPTZ,
	updated TIMESTAMPTZ DEFAULT current_timestamp,
	PRIMARY KEY (source_id)
);

-- Feeds
CREATE TABLE IF NOT EXISTS feeds (
	id serial PRIMARY KEY,
	source_id smallint REFERENCES sources (id) ON DELETE CASCADE,
	url varchar(254) UNIQUE NOT NULL,
	excerpt text NOT NULL,
	updated TIMESTAMPTZ DEFAULT current_timestamp,
	title varchar(254) NOT NULL,
	pub_date TIMESTAMPTZ NOT NULL,
	description text,
	content text,
	author varchar(32)
);

-- Test data
-- Sources
INSERT INTO sources (name, description, slug, homepage, url, image, language, country, category) VALUES
  ('Mondo', 'Mondo vesti', 'mondo', 'http://mondo.rs', 'http://mondo.rs/rss/1/Mondo', '', 'sr', 'sr', 'general'),
  ('CNBC', 'CNBC World News', 'cnbc', 'https://www.cnbc.com', 'https://www.cnbc.com/id/100727362/device/rss/rss.html', '', 'en', 'world', 'general'),
  ('RT', 'Russia Today', 'rt', 'https://www.rt.com', 'https://www.rt.com/rss/news/', '', 'en', 'ru', 'general');

-- Source status
INSERT INTO source_status (source_id, period, active) VALUES
  (1, 15, true),
  (2, 15, true),
  (3, 15, true);

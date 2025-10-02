-- Database schema for list items

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  genre TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

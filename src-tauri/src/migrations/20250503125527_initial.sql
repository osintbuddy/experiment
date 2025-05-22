-- Add migration script here
CREATE TABLE IF NOT EXISTS graphs (
  id INTEGER PRIMARY KEY,
  graphid TEXT DEFAULT (lower(hex(randomblob(16)))),
  label TEXT,
  description TEXT
  -- ctime INT DEFAULT CAST((julianday('now') - 2440587.5) * 86400.0 AS INT)
);

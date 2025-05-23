-- Add migration script here
CREATE TABLE IF NOT EXISTS graphs (
  id INTEGER PRIMARY KEY,
  graphid TEXT DEFAULT (lower(hex(randomblob(16)))),
  label TEXT,
  description TEXT,
  ctime INTEGER DEFAULT (strftime('%s', 'now'))
);

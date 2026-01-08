-- Chrome Bookmark Sync Schema for D1
-- Run with: npx wrangler d1 execute jrar-dev-db --remote --file=schema.sql

-- API keys for Chrome extension authentication
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_used_at INTEGER
);

-- Folders table (self-referencing for hierarchy)
CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY,
  chrome_id TEXT NOT NULL UNIQUE,
  parent_id TEXT,
  title TEXT NOT NULL,
  path TEXT NOT NULL,
  date_added INTEGER NOT NULL,
  date_modified INTEGER,
  position INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  chrome_id TEXT NOT NULL UNIQUE,
  folder_id TEXT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  favicon_url TEXT,
  path TEXT NOT NULL,
  date_added INTEGER NOT NULL,
  date_modified INTEGER,
  position INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_folder_id ON bookmarks(folder_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_chrome_id ON bookmarks(chrome_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_chrome_id ON folders(chrome_id);
CREATE INDEX IF NOT EXISTS idx_folders_path ON folders(path);

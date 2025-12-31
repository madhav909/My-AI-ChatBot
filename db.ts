import Database from "better-sqlite3";

export const db = new Database("chat.db");

db.exec(`
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversationId TEXT,
  sender TEXT,
  text TEXT,
  createdAt TEXT
);
`);

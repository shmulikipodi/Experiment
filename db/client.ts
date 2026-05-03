import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function createDb(): Database.Database {
  const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), 'experiment.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  const schema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf-8');
  db.exec(schema);
  return db;
}

// Lazy getter — never opens the DB at import time, only on first actual call.
// This prevents SQLITE_BUSY during next build when multiple workers import this module.
export function getDb(): Database.Database {
  if (!globalThis.__db) {
    globalThis.__db = createDb();
  }
  return globalThis.__db;
}

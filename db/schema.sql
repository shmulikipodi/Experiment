CREATE TABLE IF NOT EXISTS participants (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT    NOT NULL UNIQUE,
    result      TEXT,
    feedback    INTEGER,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    assigned_at TEXT,
    feedback_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_participants_code ON participants(code);

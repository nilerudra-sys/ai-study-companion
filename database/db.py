import os
import sqlite3
from pathlib import Path


def resolve_db_path() -> Path:
    configured_path = os.getenv("DATABASE_PATH", "").strip()
    if configured_path:
        db_path = Path(configured_path).expanduser()
        if not db_path.is_absolute():
            db_path = Path(__file__).resolve().parent.parent / db_path
    else:
        db_path = Path(__file__).resolve().parent / "study_companion.db"

    db_path.parent.mkdir(parents=True, exist_ok=True)
    return db_path


DB_PATH = resolve_db_path()


def get_db() -> sqlite3.Connection:
    # Use a longer timeout and WAL mode to reduce "database is locked" errors
    # when multiple requests hit SQLite at the same time.
    conn = sqlite3.connect(DB_PATH, timeout=30, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    conn.execute("PRAGMA busy_timeout=30000;")
    return conn

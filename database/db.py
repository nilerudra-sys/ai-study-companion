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
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

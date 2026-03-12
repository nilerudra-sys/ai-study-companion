import sqlite3
from pathlib import Path


DB_PATH = Path(__file__).resolve().parent / "study_companion.db"


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


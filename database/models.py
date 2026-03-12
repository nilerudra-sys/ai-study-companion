from dataclasses import dataclass
import sqlite3
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple


def init_db(conn: sqlite3.Connection) -> None:
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS quiz_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            topic TEXT NOT NULL,
            score REAL NOT NULL,
            points_earned INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            topic TEXT NOT NULL,
            correct_answers INTEGER NOT NULL,
            wrong_answers INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            score REAL NOT NULL,
            date TEXT,
            time TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            coins INTEGER DEFAULT 0,
            completed_topics TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()


@dataclass
class StudentProgress:
    student_id: str
    total_points: int
    total_quizzes: int
    average_score: float

@dataclass
class User:
    id: int
    username: str
    email: str
    password_hash: str
    level: int
    xp: int
    coins: int
    completed_topics: str
    created_at: str

    def to_dict(self):
        import json
        try:
            topics = json.loads(self.completed_topics) if self.completed_topics else []
        except:
            topics = []
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "level": self.level,
            "xp": self.xp,
            "coins": self.coins,
            "completed_topics": topics
        }


def record_quiz_attempt(
    db: sqlite3.Connection,
    student_id: str,
    topic: str,
    score: float,
    points_earned: int,
) -> None:
    cur = db.cursor()
    cur.execute(
        """
        INSERT INTO quiz_history (student_id, topic, score, points_earned)
        VALUES (?, ?, ?, ?)
        """,
        (student_id, topic, score, points_earned),
    )
    db.commit()


def get_student_progress(db: sqlite3.Connection, student_id: str) -> StudentProgress:
    cur = db.cursor()

    cur.execute(
        """
        SELECT
            COALESCE(SUM(points_earned), 0) AS total_points,
            COUNT(*) AS total_quizzes,
            COALESCE(AVG(score), 0.0) AS average_score
        FROM quiz_history
        WHERE student_id = ?
        """,
        (student_id,),
    )
    row = cur.fetchone()

    return StudentProgress(
        student_id=student_id,
        total_points=int(row["total_points"]),
        total_quizzes=int(row["total_quizzes"]),
        average_score=float(row["average_score"]),
    )


def save_quiz_attempt(
    db: sqlite3.Connection,
    user_id: str,
    topic: str,
    correct_answers: int,
    wrong_answers: int,
    total_questions: int,
    score: float,
    date: Optional[str] = None,
    time: Optional[str] = None,
) -> int:
    """
    Stores a quiz attempt in `quiz_attempts` using the ProgressDex schema.
    """
    now = datetime.now()
    date = date or now.strftime("%d %b %Y")
    time = time or now.strftime("%H:%M")

    cur = db.cursor()
    cur.execute(
        """
        INSERT INTO quiz_attempts (user_id, topic, correct_answers, wrong_answers, total_questions, score, date, time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (user_id, topic, correct_answers, wrong_answers, total_questions, score, date, time),
    )
    db.commit()
    return int(cur.lastrowid)


def get_quiz_history(db: sqlite3.Connection, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    cur = db.cursor()
    cur.execute(
        """
        SELECT id, user_id, topic, correct_answers, wrong_answers, total_questions, score, date, time, timestamp
        FROM quiz_attempts
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT ?
        """,
        (user_id, limit),
    )
    rows = cur.fetchall() or []
    return [dict(r) for r in rows]


def get_progress_stats(db: sqlite3.Connection, user_id: str) -> Dict[str, Any]:
    """
    Computes overall stats, best/weakest topic, and per-topic progress.
    """
    cur = db.cursor()

    cur.execute(
        """
        SELECT
            COUNT(*) AS total_quizzes,
            COALESCE(AVG(score), 0.0) AS average_score,
            COALESCE(SUM(total_questions), 0) AS total_questions_answered
        FROM quiz_attempts
        WHERE user_id = ?
        """,
        (user_id,),
    )
    agg = cur.fetchone() or {"total_quizzes": 0, "average_score": 0.0, "total_questions_answered": 0}
    total_quizzes = int(agg["total_quizzes"])
    average_score = float(agg["average_score"])
    total_questions_answered = int(agg["total_questions_answered"])

    cur.execute(
        """
        SELECT topic, COALESCE(AVG(score), 0.0) AS avg_score, COUNT(*) AS attempts
        FROM quiz_attempts
        WHERE user_id = ?
        GROUP BY topic
        ORDER BY avg_score DESC
        """,
        (user_id,),
    )
    per_topic_rows = cur.fetchall() or []

    per_topic: List[Dict[str, Any]] = [
        {"topic": r["topic"], "avg_score": float(r["avg_score"]), "attempts": int(r["attempts"])}
        for r in per_topic_rows
    ]

    best_topic = per_topic[0]["topic"] if per_topic else None
    weakest_topic = per_topic[-1]["topic"] if len(per_topic) > 1 else (per_topic[0]["topic"] if per_topic else None)

    return {
        "total_quizzes_taken": total_quizzes,
        "average_score": average_score,
        "best_topic": best_topic,
        "weakest_topic": weakest_topic,
        "total_questions_answered": total_questions_answered,
        "topic_progress": per_topic,
    }

def get_user_by_email(db: sqlite3.Connection, email: str) -> User | None:
    cur = db.cursor()
    cur.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cur.fetchone()
    if row:
        return User(**dict(row))
    return None

def get_user_by_id(db: sqlite3.Connection, user_id: int) -> User | None:
    cur = db.cursor()
    cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    if row:
        return User(**dict(row))
    return None

def create_user(db: sqlite3.Connection, username: str, email: str, password_hash: str) -> int:
    cur = db.cursor()
    cur.execute(
        """
        INSERT INTO users (username, email, password_hash)
        VALUES (?, ?, ?)
        """,
        (username, email, password_hash)
    )
    db.commit()
    return cur.lastrowid

def update_user_progress(
    db: sqlite3.Connection,
    user_id: int,
    xp_gain: int,
    coins_gain: int,
    level: int,
    completed_topics_json: str
) -> None:
    cur = db.cursor()
    cur.execute(
        """
        UPDATE users 
        SET xp = xp + ?, 
            coins = coins + ?,
            level = ?,
            completed_topics = ?
        WHERE id = ?
        """,
        (xp_gain, coins_gain, level, completed_topics_json, user_id)
    )
    db.commit()



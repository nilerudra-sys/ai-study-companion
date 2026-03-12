"""FastAPI application entrypoint.

This module is designed to be run from the `backend/` directory (e.g.
`uvicorn main:app --host 0.0.0.0 --port $PORT`) while still allowing imports
from the repo root (e.g., `database` and other top-level modules).
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure the repository root is always on sys.path so imports work regardless of
# the current working directory (Railway may start in `backend/`).
REPO_ROOT = Path(__file__).resolve().parents[1]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

# Load any `.env` variables from the repo root (common for local development).
load_dotenv(dotenv_path=REPO_ROOT / ".env")

from database import db as database_db  # noqa: E402

try:
    # When running from the repo root (e.g., `uvicorn backend.main:app`)
    from backend.routes import router as api_router  # type: ignore
    from backend.auth_routes import router as auth_router  # type: ignore
except ImportError:
    # When running from inside backend/ (e.g., `cd backend && uvicorn main:app`)
    from routes import router as api_router  # noqa: E402
    from auth_routes import router as auth_router  # noqa: E402


def get_cors_settings() -> tuple[list[str], str | None]:
    """Return CORS settings for the app."""

    # Allow all origins by default to simplify front-end integration on Railway.
    # You can restrict this in production by setting CORS_ALLOW_ORIGINS.
    configured_origins = [origin.strip() for origin in os.getenv("CORS_ALLOW_ORIGINS", "").split(",") if origin.strip()]
    allow_origins = configured_origins or ["*"]

    allow_origin_regex = os.getenv("CORS_ALLOW_ORIGIN_REGEX", "").strip() or None

    return allow_origins, allow_origin_regex


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""

    allow_origins, allow_origin_regex = get_cors_settings()

    app = FastAPI(
        title="Gamified AI Study Companion API",
        version="0.1.0",
        description="Prototype backend for AI explanations, quizzes, and gamification.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_origin_regex=allow_origin_regex,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def on_startup() -> None:
        # Ensure the database file and folder exist before serving requests.
        conn = database_db.get_db()
        conn.close()

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(api_router, prefix="/api")
    app.include_router(auth_router, prefix="/api/auth")

    return app


app = create_app()

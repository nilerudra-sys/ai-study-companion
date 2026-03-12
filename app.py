"""Top-level Uvicorn app entrypoint.

This app is designed to be deployable from multiple repository layouts.
If a `backend/` package is available, it will attempt to mount the API routers.
Otherwise it still functions as a minimal FastAPI app for health checks.
"""

from __future__ import annotations

import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parent

# Ensure `backend/` can be imported even if the repo has an extra nesting layer.
# Example structures we support:
#  - repo-root/backend/
#  - repo-root/ai-study-companion/backend/
for candidate in (ROOT / "backend", ROOT / "ai-study-companion" / "backend"):
    if candidate.is_dir():
        sys.path.insert(0, str(candidate.parent))
        break

app = FastAPI(title="AI Study Companion Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Hello from FastAPI"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# If backend routes are available, wire them in.
try:
    from backend.routes import router as api_router  # type: ignore
    from backend.auth_routes import router as auth_router  # type: ignore

    app.include_router(api_router, prefix="/api")
    app.include_router(auth_router, prefix="/api/auth")
except Exception:
    pass

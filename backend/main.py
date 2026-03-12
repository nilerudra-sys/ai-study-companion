from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import router as api_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Gamified AI Study Companion API",
        version="0.1.0",
        description="Prototype backend for AI explanations, quizzes, and gamification.",
    )

    # Allow local dev from Streamlit
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from backend.auth_routes import router as auth_router
    app.include_router(api_router, prefix="/api")
    app.include_router(auth_router, prefix="/api/auth")

    return app


app = create_app()

# Triggering reload to capture new API key

# Gamified AI Study Companion

A prototype study companion with:

- FastAPI backend for explanations, quizzes, auth, and progress tracking
- Streamlit prototype UI in `frontend/`
- React + Vite frontend in `frontend-retro/`
- SQLite for local storage
- Anthropic for AI-powered tutoring and quiz generation

## Local development

### 1. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-haiku-20240307
APP_ENV=dev
DATABASE_PATH=database/study_companion.db
CORS_ALLOW_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CORS_ALLOW_ORIGIN_REGEX=https://.*\.vercel\.app
```

For the React frontend, you can also copy `frontend-retro/.env.example` to `frontend-retro/.env`:

```bash
VITE_API_BASE=http://127.0.0.1:8000/api
```

### 3. Run the backend

```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### 4. Run the React frontend

```bash
cd frontend-retro
npm install
npm run dev
```

### 5. Optional Streamlit frontend

```bash
streamlit run frontend/app.py
```

## Deploy backend to Railway

This repo already includes `Procfile` and `railway.json` for the FastAPI app.

### Railway setup

1. Push this repo to GitHub.
2. In Railway, create a new project from the GitHub repo.
3. Railway should detect the Python service automatically.
4. Set these environment variables in Railway:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-haiku-20240307
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ALLOW_ORIGIN_REGEX=https://.*\.vercel\.app
DATABASE_PATH=/data/study_companion.db
```

### Important for SQLite on Railway

Railway containers do not keep local files permanently unless you mount a volume.

To keep quiz history and user data after redeploys:

1. Add a Railway volume.
2. Mount it at `/data`.
3. Set `DATABASE_PATH=/data/study_companion.db`.

### Backend URL

After deployment, Railway will give you a URL like:

```text
https://your-app.up.railway.app
```

Your API base for the frontend will be:

```text
https://your-app.up.railway.app/api
```

Health check endpoint:

```text
https://your-app.up.railway.app/api/health
```

## Deploy frontend to Vercel

The Vercel config in `vercel.json` is set up for the React app inside `frontend-retro/`.

### Vercel setup

1. Import the same GitHub repo into Vercel.
2. Keep the repo root as-is so Vercel can use `vercel.json`.
3. Add this environment variable in Vercel:

```bash
VITE_API_BASE=https://your-app.up.railway.app/api
```

4. Deploy.

### SPA routing

`vercel.json` rewrites all frontend routes to `index.html`, so client-side routes continue working after refresh.

## Recommended deploy order

1. Deploy the backend to Railway first.
2. Copy the Railway public URL.
3. Set `VITE_API_BASE` in Vercel.
4. Deploy the frontend to Vercel.
5. Add the final Vercel URL back into Railway as `FRONTEND_URL`.

## Project structure

```text
ai-study-companion/
|-- backend/
|-- database/
|-- frontend/
|-- frontend-retro/
|-- prompts/
|-- utils/
|-- Procfile
|-- railway.json
|-- vercel.json
|-- requirements.txt
```

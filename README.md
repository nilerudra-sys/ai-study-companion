# Gamified AI Study Companion (Prototype)

This is a prototype **Gamified AI Study Companion** that helps students learn AI concepts with:

- **AI concept explanations** (chat-style Q&A)
- **AI-generated quizzes** for selected topics
- **Gamification** (points, levels, badges)
- **Progress tracking** (quiz history, scores)

The stack is:

- **Backend**: FastAPI
- **Frontend**: Streamlit (and a React/Vite demo in `frontend-retro/`)
- **LLM**: Anthropic Claude via the official Python SDK
- **Database**: SQLite

## Getting Started

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment

Create a `.env` file in the project root (already added to the structure) and set:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-haiku-20240307
APP_ENV=dev
```

### 3. Run the backend (FastAPI)

From the project root:

```bash
uvicorn backend.main:app --reload
```

This will start the API at `http://127.0.0.1:8000`.

### 4. Run the frontend (Streamlit)

In a separate terminal, from the project root:

```bash
streamlit run frontend/app.py
```

The Streamlit UI will open in your browser and communicate with the FastAPI backend.

## Deployment to Railway (backend)

This repo includes a `Procfile` and `railway.json` to make deploying the FastAPI backend to Railway straightforward.

### 1) Link your repo to Railway

1. Go to https://railway.app and create a new project.
2. Connect your GitHub repo (this project).
3. Railway will detect the `Procfile` and run the app.

### 2) Set environment variables on Railway

In the Railway project settings, add:

- `ANTHROPIC_API_KEY` (your Anthropic key)
- `ANTHROPIC_MODEL` (e.g. `claude-3-haiku-20240307`)

Railway provides a `PORT` environment variable automatically. The backend starts using that.

### 3) Use the deployed backend URL from Railway

Once deployed, Railway provides a public URL like:

```
https://<your-project>.up.railway.app
```

Remember to use that URL as the API base for the frontend.

## Deployment to Vercel (frontend)

The `vercel.json` in this repo is configured to deploy the React/Vite frontend located in `frontend-retro/`.

### 1) Add the project to Vercel

1. Go to https://vercel.com and create a new project.
2. Connect your GitHub repo.
3. Vercel will use `vercel.json` and build `frontend-retro`.

### 2) Set the backend API base in Vercel

In Vercel project settings, add an environment variable:

- `VITE_API_BASE` = `https://<your-railway-app>.up.railway.app/api`

This ensures the frontend talks to the Railway backend.

### 3) Access the live app

Once deployed, Vercel provides a public URL where the frontend is served.

## Project Structure

High-level structure (matching the requested layout):

```text
ai-study-companion/
├── frontend/
│   ├── app.py
│   ├── chat_ui.py
│   ├── quiz_ui.py
│   └── progress_ui.py
├── backend/
│   ├── main.py
│   ├── routes.py
│   ├── ai_service.py
│   ├── quiz_generator.py
│   └── gamification.py
├── database/
│   ├── db.py
│   └── models.py
├── prompts/
│   ├── explanation_prompt.txt
│   └── quiz_prompt.txt
├── utils/
│   └── helpers.py
├── requirements.txt
├── .env
└── README.md
```

## Notes

- This is a **prototype**, so the implementation is intentionally simple and easy to read.
- You can switch to other LLM providers (e.g. Gemini) by swapping out `backend/ai_service.py` while preserving the function signatures used elsewhere.


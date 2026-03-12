# Backend Integration Implementation Plan

## Goal Description
We need to wire the newly created React frontend (`frontend-retro`) to the existing Python FastAPI backend so that the application uses actual AI generation and tracks real user progress in the SQLite database instead of using mocked data.

The frontend will assume a default `student_id` of `"retro-student"`.

## Proposed Changes

### [NEW] `frontend-retro/src/api.js`
Create a centralized API service module using standard `fetch` to communicate with the FastAPI backend at `http://127.0.0.1:8000/api`.
- `fetchProgress(studentId)`: calls `GET /progress/{student_id}`
- `askTutor(studentId, question)`: calls `POST /explain`
- `generateQuiz(studentId, topic)`: calls `POST /quiz`
- `submitQuiz(studentId, topic, questions, selectedIndices)`: calls `POST /quiz/submit`

### [MODIFY] [frontend-retro/src/App.jsx](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/frontend-retro/src/App.jsx)
- Replace hardcoded `playerState` initialization with a `useEffect` that calls `fetchProgress("retro-student")`.
- Map the backend [ProgressResponse](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/backend/routes.py#58-65) (`total_points`, `level`, `badges`) to the existing state. We'll map `total_points` to [xp](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/backend/routes.py#78-86) and `coins`.
- Expose the API client or data fetching context to child components.

### [MODIFY] [frontend-retro/src/components/ChatTutor.jsx](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/frontend-retro/src/components/ChatTutor.jsx)
- Replace the `setTimeout` mock inside [handleSendMessage](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/frontend-retro/src/components/ChatTutor.jsx#11-28).
- Call the [explain](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/backend/routes.py#78-86) API endpoint with the student's question.
- Update the `messages` state with the real LLM `answer`.

### [MODIFY] [frontend-retro/src/components/QuizBattle.jsx](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/frontend-retro/src/components/QuizBattle.jsx)
- Replace the `mockQuiz` array with state that is fetched dynamically.
- In [handleStartQuiz](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/frontend-retro/src/components/QuizBattle.jsx#35-41), switch to a Loading state and call the [quiz](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/backend/routes.py#88-96) API.
- Track `selected_indices` as the user answers.
- When the quiz finishes, call the [submit_quiz](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/backend/routes.py#98-129) API to register the results in the backend DB and update the global Gamification state (Top HUD).

### [MODIFY] [frontend-retro/src/components/TopHUD.jsx](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/frontend-retro/src/components/TopHUD.jsx)
- Adjust mapping if `badges` shape from backend differs slightly (backend returns a list of Badge objects/strings).

### [MODIFY] [frontend-retro/src/components/Badges.jsx](file:///c:/Users/ASUS/OneDrive/Desktop/ai%20learn/ai-study-companion/frontend-retro/src/components/Badges.jsx)
- Adjust to handle the backend's returned badge shapes.

## Verification Plan
### Manual Verification
1. Ensure the backend is running (`uvicorn backend.main:app --reload`).
2. Reload the React application.
3. Verify that the HUD pulls the current (0 points, Level 1) state from SQLite.
4. Go to **Ask AI Tutor**, enter a question, and confirm a real LLM response is returned.
5. Go to **Start Quiz Battle**, generate a quiz, complete it, and verify that the level and badges update properly across the UI based on the backend calculation.

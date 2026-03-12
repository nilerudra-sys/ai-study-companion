from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

# The project can be run either from the repo root (as a package) or from within
# the backend folder (as a module). Support both import styles.
try:
    # Root-level package import (used when running from repo root).
    from backend.ai_service import explain_concept, chat_answer, generate_professor_advice
    from backend.quiz_generator import generate_quiz, generate_expert_quiz
    from backend.gamification import (
        calculate_points_for_quiz,
        get_level_from_points,
        Badge,
    )
except ImportError:
    # Module-level import (used when running from inside backend/).
    from ai_service import explain_concept, chat_answer, generate_professor_advice
    from quiz_generator import generate_quiz, generate_expert_quiz
    from gamification import (
        calculate_points_for_quiz,
        get_level_from_points,
        Badge,
    )

from database.db import get_db
from database.models import (
    init_db,
    record_quiz_attempt,
    get_student_progress,
    save_quiz_attempt,
    get_quiz_history,
    get_progress_stats,
)


router = APIRouter()


class ExplainRequest(BaseModel):
    student_id: str
    question: str
    topic: Optional[str] = None


class ExplainResponse(BaseModel):
    answer: str


class QuizRequest(BaseModel):
    student_id: str
    topic: str
    num_questions: int = 5
    difficulty: str = "beginner"


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_index: int


class QuizResponse(BaseModel):
    topic: str
    questions: List[QuizQuestion]


class QuizSubmitRequest(BaseModel):
    student_id: str
    topic: str
    questions: List[QuizQuestion]
    selected_indices: List[int]


class ProgressResponse(BaseModel):
    student_id: str
    total_points: int
    level: int
    badges: List[Badge]
    total_quizzes: int
    average_score: float


class SaveQuizAttemptRequest(BaseModel):
    user_id: str
    topic: str
    correct_answers: int
    wrong_answers: int
    total_questions: int
    score: float
    date: Optional[str] = None
    time: Optional[str] = None


class QuizAttempt(BaseModel):
    id: int
    user_id: str
    topic: str
    correct_answers: int
    wrong_answers: int
    total_questions: int
    score: float
    date: Optional[str] = None
    time: Optional[str] = None


class ProgressStatsResponse(BaseModel):
    user_id: str
    total_quizzes_taken: int
    average_score: float
    best_topic: Optional[str] = None
    weakest_topic: Optional[str] = None
    total_questions_answered: int
    topic_progress: List[dict]
    world_summary: dict
    professor_advice: str


@router.on_event("startup")
def on_startup() -> None:
    db = get_db()
    init_db(db)


@router.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@router.post("/explain", response_model=ExplainResponse)
async def explain(request: ExplainRequest) -> ExplainResponse:
    answer = await explain_concept(
        student_id=request.student_id,
        question=request.question,
        topic=request.topic,
    )
    return ExplainResponse(answer=answer)


@router.post("/quiz", response_model=QuizResponse)
async def quiz(request: QuizRequest) -> QuizResponse:
    import traceback
    import traceback
    try:
        raw_questions = await generate_quiz(
            topic=request.topic,
            num_questions=request.num_questions,
            difficulty=request.difficulty,
        )
        questions = [QuizQuestion(**q) for q in raw_questions]
        return QuizResponse(topic=request.topic, questions=questions)
    except Exception as e:
        with open("route-error.log", "w", encoding="utf-8") as f:
            traceback.print_exc(file=f)
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/expert-quiz", response_model=QuizResponse)
async def expert_quiz(request: QuizRequest) -> QuizResponse:
    raw_questions = await generate_expert_quiz(
        topic=request.topic,
        num_questions=request.num_questions,
    )
    questions = [QuizQuestion(**q) for q in raw_questions]
    return QuizResponse(topic=request.topic, questions=questions)


@router.post("/quiz/submit", response_model=ProgressResponse)
async def submit_quiz(request: QuizSubmitRequest) -> ProgressResponse:
    correct_count = 0
    for idx, q in enumerate(request.questions):
        if idx < len(request.selected_indices) and request.selected_indices[idx] == q.correct_index:
            correct_count += 1

    score = correct_count / max(len(request.questions), 1)
    points_earned = calculate_points_for_quiz(score)
    wrong_count = max(len(request.questions) - correct_count, 0)

    with get_db() as db:
        record_quiz_attempt(
            db=db,
            student_id=request.student_id,
            topic=request.topic,
            score=score,
            points_earned=points_earned,
        )
        save_quiz_attempt(
            db=db,
            user_id=request.student_id,
            topic=request.topic,
            correct_answers=correct_count,
            wrong_answers=wrong_count,
            total_questions=len(request.questions),
            score=score,
        )

        progress = get_student_progress(db, request.student_id)
        level = get_level_from_points(progress.total_points)
        badges = Badge.from_progress(progress)

    return ProgressResponse(
        student_id=request.student_id,
        total_points=progress.total_points,
        level=level,
        badges=badges,
        total_quizzes=progress.total_quizzes,
        average_score=progress.average_score,
    )


@router.get("/progress/{student_id}", response_model=ProgressResponse)
def get_progress(student_id: str) -> ProgressResponse:
    db = get_db()
    progress = get_student_progress(db, student_id)
    level = get_level_from_points(progress.total_points)
    badges = Badge.from_progress(progress)

    return ProgressResponse(
        student_id=student_id,
        total_points=progress.total_points,
        level=level,
        badges=badges,
        total_quizzes=progress.total_quizzes,
        average_score=progress.average_score,
    )


@router.get("/quiz-history", response_model=List[QuizAttempt])
def quiz_history(user_id: str, limit: int = 50) -> List[QuizAttempt]:
    db = get_db()
    rows = get_quiz_history(db, user_id=user_id, limit=limit)
    return [QuizAttempt(**r) for r in rows]


@router.post("/save-quiz-attempt")
def save_attempt(request: SaveQuizAttemptRequest) -> dict:
    db = get_db()
    attempt_id = save_quiz_attempt(
        db=db,
        user_id=request.user_id,
        topic=request.topic,
        correct_answers=request.correct_answers,
        wrong_answers=request.wrong_answers,
        total_questions=request.total_questions,
        score=request.score,
        date=request.date,
        time=request.time,
    )
    return {"status": "ok", "id": attempt_id}


@router.get("/progress-stats", response_model=ProgressStatsResponse)
async def progress_stats(user_id: str) -> ProgressStatsResponse:
    db = get_db()
    stats = get_progress_stats(db, user_id=user_id)

    known_topics = ["Intro to AI", "Machine Learning", "Neural Networks", "Deep Learning"]
    started = {t["topic"] for t in stats["topic_progress"]}
    completed = {
        t["topic"]
        for t in stats["topic_progress"]
        if float(t["avg_score"]) >= 0.8 and int(t["attempts"]) >= 1
    }
    in_progress = started - completed
    locked = set(known_topics) - started

    world_summary = {
        "topics_completed": len(completed),
        "topics_in_progress": len(in_progress),
        "topics_locked": len(locked),
    }

    professor_advice = await generate_professor_advice(
        user_id=user_id,
        stats=stats,
        world_summary=world_summary,
    )

    return ProgressStatsResponse(
        user_id=user_id,
        total_quizzes_taken=stats["total_quizzes_taken"],
        average_score=stats["average_score"],
        best_topic=stats["best_topic"],
        weakest_topic=stats["weakest_topic"],
        total_questions_answered=stats["total_questions_answered"],
        topic_progress=stats["topic_progress"],
        world_summary=world_summary,
        professor_advice=professor_advice,
    )


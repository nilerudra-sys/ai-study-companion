from dataclasses import dataclass
from typing import List

from database.models import StudentProgress


def calculate_points_for_quiz(score: float) -> int:
    """
    Very simple points system:
    - full score (1.0) -> 100 points
    - linear otherwise
    """
    score = max(0.0, min(score, 1.0))
    return int(score * 100)


def get_level_from_points(points: int) -> int:
    """
    Simple leveling curve:
    - Level 1: 0–199
    - Level 2: 200–399
    - Level 3: 400–699
    - Level 4+: grows slowly
    """
    if points < 200:
        return 1
    if points < 400:
        return 2
    if points < 700:
        return 3
    # After that, every extra 300 points = 1 level
    return 3 + (points - 700) // 300 + 1


@dataclass
class Badge:
    name: str
    description: str

    @staticmethod
    def from_progress(progress: StudentProgress) -> List["Badge"]:
        badges: List[Badge] = []

        if progress.total_quizzes >= 1:
            badges.append(Badge(name="First Quiz!", description="Completed your first quiz."))

        if progress.total_points >= 200:
            badges.append(Badge(name="Rising Star", description="Earned 200+ points."))

        if progress.total_points >= 500:
            badges.append(Badge(name="AI Explorer", description="Earned 500+ points learning AI."))

        if progress.average_score >= 0.9 and progress.total_quizzes >= 3:
            badges.append(Badge(name="Quiz Master", description="Average score ≥ 90% on 3+ quizzes."))

        return badges


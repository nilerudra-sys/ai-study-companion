import os
from typing import Optional

from dotenv import load_dotenv
from anthropic import AsyncAnthropic

from prompts import explanation_prompt


load_dotenv()

_client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
_model = os.getenv("ANTHROPIC_MODEL", "claude-3-haiku-20240307")


async def explain_concept(student_id: str, question: str, topic: Optional[str] = None) -> str:
    """
    Generates an explanation for a student's AI-related question using Anthropic.
    """
    base_prompt = explanation_prompt.load_template()

    full_prompt = base_prompt.format(
        topic=topic or "general AI",
        question=question,
    )

    response = await _client.messages.create(
        model=_model,
        max_tokens=1000,
        system="You are a friendly AI tutor who explains concepts clearly to beginners.",
        messages=[
            {"role": "user", "content": full_prompt},
        ],
        temperature=0.6,
    )

    return response.content[0].text.strip()


async def chat_answer(student_id: str, message: str) -> str:
    """
    Simple chat-style answer endpoint.
    """
    response = await _client.messages.create(
        model=_model,
        max_tokens=1000,
        system="You are a helpful AI tutor specializing in explaining AI and ML concepts.",
        messages=[
            {"role": "user", "content": message},
        ],
        temperature=0.7,
    )
    return response.content[0].text.strip()


async def generate_professor_advice(user_id: str, stats: dict, world_summary: dict) -> str:
    """
    Generates a retro "Professor AI" message based on ProgressDex stats.
    """
    topic_lines = []
    for t in stats.get("topic_progress", []):
        pct = int(round(float(t.get("avg_score", 0.0)) * 100))
        topic_lines.append(f"- {t.get('topic')}: {pct}%")

    best = stats.get("best_topic") or "N/A"
    weak = stats.get("weakest_topic") or "N/A"

    user_prompt = (
        "Write a short Pokémon FireRed-style professor message analyzing a student's learning progress.\n"
        "Use this structure:\n"
        '1) Greeting: "Hello Trainer! I have analyzed your learning journey."\n'
        "2) Two lines of topic progress (or fewer if not available)\n"
        "3) 'You are strongest in:' bullet list\n"
        "4) 'You should practice more:' bullet list\n"
        "Keep it concise, friendly, and retro.\n\n"
        f"User: {user_id}\n"
        f"Overall average score: {int(round(stats.get('average_score', 0.0) * 100))}%\n"
        f"Total quizzes: {stats.get('total_quizzes_taken', 0)}\n"
        f"Topic progress:\n" + ("\n".join(topic_lines) if topic_lines else "- No topics yet\n") +
        f"\nBest topic: {best}\n"
        f"Weakest topic: {weak}\n"
        f"World summary: {world_summary}\n"
    )

    response = await _client.messages.create(
        model=_model,
        max_tokens=350,
        system="You are Professor AI in a retro Pokémon-style learning game.",
        messages=[{"role": "user", "content": user_prompt}],
        temperature=0.5,
    )
    return response.content[0].text.strip()


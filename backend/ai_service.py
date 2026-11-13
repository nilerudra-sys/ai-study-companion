import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

from prompts import explanation_prompt


# Ensure `.env` from the repo root is loaded even when running from `backend/`.
ROOT = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=ROOT / ".env")

# Provider selection: AI_PROVIDER=gemini|anthropic. If unset, Gemini is used
# whenever GEMINI_API_KEY is present, otherwise Anthropic.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
AI_PROVIDER = (os.getenv("AI_PROVIDER") or ("gemini" if GEMINI_API_KEY else "anthropic")).lower()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-haiku-5-5")

_gemini_client = None
_anthropic_client = None


def _gemini():
    global _gemini_client
    if _gemini_client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError("Missing required environment variable: GEMINI_API_KEY.")
        from google import genai

        _gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    return _gemini_client


def _anthropic():
    global _anthropic_client
    if _anthropic_client is None:
        if not ANTHROPIC_API_KEY:
            raise RuntimeError("Missing required environment variable: ANTHROPIC_API_KEY.")
        from anthropic import AsyncAnthropic

        _anthropic_client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    return _anthropic_client


async def generate_text(system: str, prompt: str, max_tokens: int = 1000) -> str:
    """Single entry point for every AI call in the app."""
    if AI_PROVIDER == "gemini":
        interaction = await _gemini().aio.interactions.create(
            model=GEMINI_MODEL,
            system_instruction=system,
            input=prompt,
            generation_config={"max_output_tokens": max_tokens},
        )
        return interaction.output_text or ""

    response = await _anthropic().messages.create(
        model=ANTHROPIC_MODEL,
        thinking={"type": "disabled"},
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )
    return "".join(b.text for b in response.content if b.type == "text")


async def explain_concept(student_id: str, question: str, topic: Optional[str] = None) -> str:
    """
    Generates an explanation for a student's AI-related question using the configured AI provider.
    """
    base_prompt = explanation_prompt.load_template()

    full_prompt = base_prompt.format(
        topic=topic or "general AI",
        question=question,
    )

    text = await generate_text(system="You are a friendly AI tutor who explains concepts clearly to beginners.", prompt=full_prompt, max_tokens=1000)

    return text.strip()


async def chat_answer(student_id: str, message: str) -> str:
    """
    Simple chat-style answer endpoint.
    """
    text = await generate_text(system="You are a helpful AI tutor specializing in explaining AI and ML concepts.", prompt=message, max_tokens=1000)
    return text.strip()


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

    text = await generate_text(system="You are Professor AI in a retro Pokémon-style learning game.", prompt=user_prompt, max_tokens=350)
    return text.strip()


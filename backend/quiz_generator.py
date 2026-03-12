from typing import List

from pydantic import BaseModel

from .ai_service import _client, _model  # reuse client/model for simplicity
from prompts import quiz_prompt


from .crew_agents import create_quiz_crew




async def _parse_crew_output(content: str, topic: str) -> List[dict]:
    import json
    import re

    # Sometimes LLMs wrap JSON in markdown block even when told not to.
    match = re.search(r'\{.*\}', content.replace('\n', ''), re.DOTALL)
    if match:
        content = match.group(0)

    try:
        data = json.loads(content)
        questions_data = data.get("questions", [])
    except Exception as e:
        print(f"Failed to parse CrewAI JSON: {e}\nRaw fallback:\n{content}")
        questions_data = [
            {
                "question": f"CrewAI failed to generate parseable JSON for {topic}.",
                "options": ["Try again", "Report Error", "Skip", "Close"],
                "correct_index": 0,
            }
        ]

    questions: List[dict] = []
    for q in questions_data:
        questions.append({
            "question": q.get("question", ""),
            "options": q.get("options", []),
            "correct_index": int(q.get("correct_index", 0)),
        })
    return questions


async def generate_quiz(topic: str, num_questions: int = 5, difficulty: str = "beginner") -> List[dict]:
    """
    Uses Anthropic directly to generate a small multiple-choice quiz quickly.
    """
    system_prompt = (
        f"You are a helpful AI tutor creating a {difficulty}-level multiple-choice quiz. "
        "Respond ONLY in valid JSON. The format MUST be an object containing a 'questions' array. "
        "Each question MUST be an object with: "
        "'question' (string), "
        "'options' (an array of exactly 4 strings), "
        "'correct_index' (integer 0-3 indicating the index of the correct option)."
    )
    
    user_prompt = f"Please generate a {num_questions}-question quiz on the topic: '{topic}'."
    
    response = await _client.messages.create(
        model=_model,
        max_tokens=2000,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
        temperature=0.7,
    )
    
    content = response.content[0].text.strip()
    return await _parse_crew_output(content, topic)


async def generate_expert_quiz(topic: str, num_questions: int = 5) -> List[dict]:
    """
    Uses Anthropic directly to generate highly difficult, reasoning-based Gym Leader questions quickly.
    """
    system_prompt = (
        "You are an expert examiner for a 'Pokemon Gym'-style assessment on advanced Machine Learning and AI topics. "
        "The user wants an expert-level quiz to test their mastery. "
        "Respond ONLY in valid JSON. The format MUST be an object containing a 'questions' array. "
        "Each question MUST be an object with: "
        "'question' (string, a highly difficult, tricky, or reasoning-based question), "
        "'options' (an array of exactly 4 strings, with plausible distractors), "
        "'correct_index' (integer 0-3 indicating the index of the correct option)."
    )
    
    user_prompt = f"Please generate a {num_questions}-question expert-level quiz on the topic: '{topic}'."
    
    response = await _client.messages.create(
        model=_model,
        max_tokens=2000,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
        temperature=0.7,
    )
    
    content = response.content[0].text.strip()
    return await _parse_crew_output(content, topic)


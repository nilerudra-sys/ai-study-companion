import os
from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic

# Need a robust agentic model
def get_llm():
    return ChatAnthropic(
        model=os.getenv("ANTHROPIC_MODEL", "claude-3-haiku-20240307"),
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
    )

def _create_agents(topic: str, difficulty: str = "beginner"):
    llm = get_llm()

    # 1. Topic Researcher
    researcher = Agent(
        role='Curriculum Researcher',
        goal=f'Identify 3-5 core educational concepts about {topic} suitable for {difficulty} level.',
        backstory='You are an expert curriculum developer who distills complex computer science and AI topics into their most critical learning objectives.',
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    # 2. Quiz Formulator
    formulator = Agent(
        role='Assessment Creator',
        goal='Take core educational concepts and formulate them into strict JSON multiple-choice questions.',
        backstory='You are a precise JSON architect. You take facts and construct `QuizQuestion` payloads strictly formatted as `{"questions": [{ "question": "...", "options": ["...", "...", "...", "..."], "correct_index": 0 }]}`. You NEVER output markdown or conversational text, only pure JSON.',
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    return researcher, formulator

def create_quiz_crew(topic: str, num_questions: int, difficulty: str = "beginner", is_expert: bool = False) -> str:
    researcher, formulator = _create_agents(topic, difficulty)

    expert_instructions = ""
    if is_expert:
        expert_instructions = "The questions MUST be highly conceptual, reasoning-based, and difficult (Gym Leader Boss Tier). Do not ask basic definitions; ask applied scenario questions."

    research_task = Task(
        description=f'Identify key concepts needed to teach a student about {topic}. Provide exactly {num_questions} core facts/concepts. {expert_instructions}',
        expected_output=f'A numbered list of {num_questions} detailed concepts.',
        agent=researcher
    )

    format_task = Task(
        description=f'Convert the researched concepts into EXACTLY {num_questions} multiple-choice questions. Output MUST be ONLY valid JSON matching this schema: {{"questions": [{{ "question": str, "options": [str, str, str, str], "correct_index": int }}]}}. Do not wrap the JSON in markdown code blocks like ```json.',
        expected_output=f'A strictly formatted JSON payload with {num_questions} questions.',
        agent=formulator
    )

    crew = Crew(
        agents=[researcher, formulator],
        tasks=[research_task, format_task],
        process=Process.sequential,
        verbose=True
    )

    result = crew.kickoff()
    return str(result)

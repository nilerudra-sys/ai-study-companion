import os

import streamlit as st
import httpx
from typing import List


API_BASE = os.getenv("API_BASE", "http://127.0.0.1:8000/api")


def render_quiz(student_id: str) -> None:
    st.subheader("AI-Generated Quiz")

    topic = st.text_input("Quiz topic", value="Machine Learning basics")
    num_questions = st.slider("Number of questions", 3, 10, 5)
    difficulty = st.selectbox("Difficulty", ["beginner", "intermediate"])

    if "quiz_questions" not in st.session_state:
        st.session_state.quiz_questions = None

    if st.button("Generate quiz"):
        with st.spinner("Generating quiz..."):
            try:
                resp = httpx.post(
                    f"{API_BASE}/quiz",
                    json={
                        "student_id": student_id,
                        "topic": topic,
                        "num_questions": num_questions,
                        "difficulty": difficulty,
                    },
                    timeout=120,
                )
                resp.raise_for_status()
                data = resp.json()
                st.session_state.quiz_questions = data.get("questions", [])
                st.success("Quiz generated!")
            except Exception as e:
                st.error(f"Failed to generate quiz: {e}")

    if st.session_state.quiz_questions:
        st.markdown("### Your Quiz")
        selected_indices: List[int] = []

        for idx, q in enumerate(st.session_state.quiz_questions):
            st.markdown(f"**Q{idx + 1}. {q['question']}**")
            choice = st.radio(
                label=f"Question {idx + 1}",
                options=list(range(len(q["options"]))),
                format_func=lambda i, opts=q["options"]: opts[i],
                key=f"quiz_q_{idx}",
            )
            selected_indices.append(choice)

        if st.button("Submit answers"):
            with st.spinner("Submitting quiz and updating progress..."):
                try:
                    resp = httpx.post(
                        f"{API_BASE}/quiz/submit",
                        json={
                            "student_id": student_id,
                            "topic": topic,
                            "questions": st.session_state.quiz_questions,
                            "selected_indices": selected_indices,
                        },
                    )
                    resp.raise_for_status()
                    progress = resp.json()
                    st.success("Quiz submitted!")
                    st.markdown("### Results")
                    st.write(f"Total points: **{progress['total_points']}**")
                    st.write(f"Level: **{progress['level']}**")
                    st.write(f"Total quizzes: **{progress['total_quizzes']}**")
                    st.write(f"Average score: **{progress['average_score'] * 100:.1f}%**")

                    badges = progress.get("badges", [])
                    if badges:
                        st.markdown("### Badges")
                        for b in badges:
                            st.write(f"🏅 **{b['name']}** – {b['description']}")
                except Exception as e:
                    st.error(f"Failed to submit quiz: {e}")


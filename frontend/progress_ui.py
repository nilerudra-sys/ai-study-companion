import os

import streamlit as st
import httpx


API_BASE = os.getenv("API_BASE", "http://127.0.0.1:8000/api")


def render_progress(student_id: str) -> None:
    st.subheader("Your Progress")

    if st.button("Refresh progress"):
        _load_and_show(student_id)

    # Initial load
    _load_and_show(student_id)


def _load_and_show(student_id: str) -> None:
    try:
        resp = httpx.get(f"{API_BASE}/progress/{student_id}")
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        st.error(f"Failed to load progress: {e}")
        return

    st.write(f"Student ID: **{data['student_id']}**")
    st.write(f"Total points: **{data['total_points']}**")
    st.write(f"Level: **{data['level']}**")
    st.write(f"Total quizzes: **{data['total_quizzes']}**")
    st.write(f"Average score: **{data['average_score'] * 100:.1f}%**")

    badges = data.get("badges", [])
    if badges:
        st.markdown("### Badges")
        for b in badges:
            st.write(f"🏅 **{b['name']}** – {b['description']}")
    else:
        st.info("No badges yet — take some quizzes to earn them!")


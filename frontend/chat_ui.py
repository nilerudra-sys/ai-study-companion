import os

import streamlit as st
import httpx


API_BASE = os.getenv("API_BASE", "http://127.0.0.1:8000/api")


def render_chat(student_id: str) -> None:
    st.subheader("AI Concept Explanation")
    st.write("Ask any question about AI or machine learning.")

    topic = st.text_input("Topic (optional)", placeholder="e.g., Neural Networks")
    question = st.text_area("Your question", height=120)

    if st.button("Ask AI"):
        if not question.strip():
            st.warning("Please enter a question.")
            return

        with st.spinner("Getting explanation from AI..."):
            try:
                resp = httpx.post(
                    f"{API_BASE}/explain",
                    json={"student_id": student_id, "question": question, "topic": topic or None},
                    timeout=60,
                )
                resp.raise_for_status()
                data = resp.json()
                st.markdown("### Explanation")
                st.write(data.get("answer", "No answer returned."))
            except Exception as e:
                st.error(f"Failed to get explanation: {e}")


import streamlit as st

from .chat_ui import render_chat
from .quiz_ui import render_quiz
from .progress_ui import render_progress


def main() -> None:
    st.set_page_config(
        page_title="Gamified AI Study Companion",
        page_icon="🎓",
        layout="wide",
    )

    st.title("Gamified AI Study Companion")
    st.caption("Prototype – AI explanations, quizzes, and gamified progress tracking.")

    with st.sidebar:
        st.header("Student")
        student_id = st.text_input("Your ID", value="demo-student")
        st.markdown("---")
        section = st.radio(
            "Go to",
            options=["Concept Chat", "Quizzes", "Progress"],
            index=0,
        )

    if not student_id.strip():
        st.warning("Please enter a student ID in the sidebar.")
        return

    if section == "Concept Chat":
        render_chat(student_id)
    elif section == "Quizzes":
        render_quiz(student_id)
    elif section == "Progress":
        render_progress(student_id)


if __name__ == "__main__":
    main()


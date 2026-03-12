from pathlib import Path


_BASE = Path(__file__).resolve().parent


class explanation_prompt:
    @staticmethod
    def load_template() -> str:
        return (_BASE / "explanation_prompt.txt").read_text(encoding="utf-8")


class quiz_prompt:
    @staticmethod
    def load_template() -> str:
        return (_BASE / "quiz_prompt.txt").read_text(encoding="utf-8")


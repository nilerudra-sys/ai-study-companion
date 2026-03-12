from typing import Any, Dict


def safe_get(d: Dict[str, Any], key: str, default: Any = None) -> Any:
    return d.get(key, default)


def format_percentage(value: float) -> str:
    return f"{value * 100:.1f}%"


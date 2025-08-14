import json
import numpy as np
from typing import Optional


def load_json(path: str) -> dict:
    """Load JSON file."""
    with open(path, "r") as f:
        return json.load(f)


def normalize_age(age: Optional[float], amin: float, amax: float, amean: float) -> float:
    """Normalize age to [0, 1] range."""
    if age is None:
        age = amean
    try:
        age = float(age)
    except Exception:
        age = amean
    if amax == amin:
        return 0.0
    return (age - amin) / (amax - amin)

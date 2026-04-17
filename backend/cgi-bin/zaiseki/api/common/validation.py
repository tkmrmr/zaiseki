import sys

from common import send_json


def parse_positive_int(value: int, name="Value") -> int:
    try:
        if value <= 0:
            raise ValueError
        return value
    except (TypeError, ValueError):
        send_json({"ok": False, "error": f"Invalid {name}"})
        sys.exit(0)

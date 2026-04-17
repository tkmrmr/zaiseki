import json
import os
import sys


def read_json_body() -> dict:
    length = int(os.environ.get("CONTENT_LENGTH", 0))
    body = sys.stdin.read(length) if length > 0 else ""
    return json.loads(body)

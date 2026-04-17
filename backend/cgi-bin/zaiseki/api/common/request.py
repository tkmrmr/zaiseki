import json
import os
import sys
from typing import TypeVar

T = TypeVar("T")


def read_json_body(cls: type[T]) -> T:
    length = int(os.environ.get("CONTENT_LENGTH", 0))
    body = sys.stdin.read(length) if length > 0 else ""
    return cls(**json.loads(body))

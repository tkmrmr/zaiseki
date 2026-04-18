from typing import TypeVar

T = TypeVar("T")


def parse_request(raw_data: dict, cls: type[T]) -> T | None:
    if not isinstance(raw_data, dict):
        return None
    try:
        return cls(**raw_data)
    except TypeError:
        return None

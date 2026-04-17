def parse_positive_int(value: int, name: str = "Value") -> int:
    if not isinstance(value, int) or value <= 0:
        raise ValueError(f"Invalid {name}")
    return value

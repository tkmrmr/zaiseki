def is_valid_positive_int(value: int) -> bool:
    if isinstance(value, int) and value > 0:
        return True
    return False

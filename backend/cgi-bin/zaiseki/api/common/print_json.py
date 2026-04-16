import json


def print_json(response: dict) -> None:
    print(json.dumps(response, ensure_ascii=False))

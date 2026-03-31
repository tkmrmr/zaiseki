import json


def print_json(response: dict):
    print(json.dumps(response, ensure_ascii=False))

import json


def send_json(response: dict) -> None:
    print("Content-Type: application/json; charset=utf-8")
    print()
    print(json.dumps(response, ensure_ascii=False))

import os
from pathlib import Path

import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"

load_dotenv()


def is_bocco_enabled():
    return os.getenv("ENABLE_BOCCO", "false").lower() == "true"


def get_access_token(refresh_token: str) -> str:
    headers = {
        "Content-Type": "application/json",
    }
    json_data = {
        "refresh_token": refresh_token,
    }
    response = requests.post(
        "https://platform-api.bocco.me/oauth/token/refresh",
        headers=headers,
        json=json_data,
    )
    access_token = response.json()["access_token"]
    return access_token


def sent_message(message: str) -> None:
    if not is_bocco_enabled():
        return
    refresh_token = os.getenv("BOCCO_REFRESH_TOKEN")
    room_id = os.getenv("BOCCO_ROOM_ID")
    if not refresh_token or not room_id:
        return
    access_token = get_access_token(refresh_token)
    headers = {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json",
    }
    json_data = {
        "text": message,
    }
    requests.post(
        f"https://platform-api.bocco.me/v1/rooms/{room_id}/messages/text",
        headers=headers,
        json=json_data,
    )


def main():
    message = input("Please input message:")
    sent_message(message)


if __name__ == "__main__":
    main()

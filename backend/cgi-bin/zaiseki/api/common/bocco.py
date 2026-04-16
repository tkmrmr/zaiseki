import os
import sys
from pathlib import Path
from types import ModuleType
from typing import TypedDict

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)

_TIMEOUT = (5, 10)


class BoccoRefreshResponse(TypedDict):
    access_token: str
    refresh_token: str


def _is_bocco_enabled() -> bool:
    return os.getenv("ENABLE_BOCCO", "false").lower() == "true"


def _get_requests() -> ModuleType | None:
    try:
        import requests

        return requests
    except ImportError:
        print("requests is not installed; BOCCO integration disabled", file=sys.stderr)
        return None


def _get_access_token(refresh_token: str) -> str | None:
    requests: ModuleType | None = _get_requests()
    if requests is None:
        return None
    headers = {
        "Content-Type": "application/json",
    }
    json_data = {
        "refresh_token": refresh_token,
    }
    try:
        response = requests.post(
            "https://platform-api.bocco.me/oauth/token/refresh",
            headers=headers,
            json=json_data,
            timeout=_TIMEOUT,
        )
    except requests.exceptions.RequestException as e:
        print(f"BOCCO token refresh request failed: {e}", file=sys.stderr)
        return None
    if not response.ok:
        print(
            f"BOCCO token refresh failed: {response.status_code} {response.text}",
            file=sys.stderr,
        )
        return None
    try:
        data: BoccoRefreshResponse = response.json()
    except ValueError as e:
        print(f"BOCCO token refresh response is not valid JSON: {e}", file=sys.stderr)
        return None
    access_token = data.get("access_token")
    if not access_token:
        print("BOCCO token refresh response missing access_token", file=sys.stderr)
        return None
    return access_token


def send_message(message: str) -> None:
    if not _is_bocco_enabled():
        return
    refresh_token = os.getenv("BOCCO_REFRESH_TOKEN")
    room_id = os.getenv("BOCCO_ROOM_ID")
    if not refresh_token or not room_id:
        print("BOCCO_REFRESH_TOKEN or BOCCO_ROOM_ID not set; skipping", file=sys.stderr)
        return
    access_token = _get_access_token(refresh_token)
    if not access_token:
        return
    requests: ModuleType | None = _get_requests()
    if requests is None:
        return
    headers = {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json",
    }
    json_data = {
        "text": message,
    }
    try:
        response = requests.post(
            f"https://platform-api.bocco.me/v1/rooms/{room_id}/messages/text",
            headers=headers,
            json=json_data,
            timeout=_TIMEOUT,
        )
    except requests.exceptions.RequestException as e:
        print(f"BOCCO send message request failed: {e}", file=sys.stderr)
        return
    if not response.ok:
        print(
            f"BOCCO send message failed: {response.status_code} {response.text}",
            file=sys.stderr,
        )

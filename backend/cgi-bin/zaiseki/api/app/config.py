import os
from pathlib import Path

from vendor.dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)


class Config:
    DB_HOST = os.getenv("MARIADB_HOST", "db")
    DB_USER = os.getenv("MARIADB_USER")
    DB_PASSWORD = os.getenv("MARIADB_PASSWORD")
    DB_NAME = os.getenv("MARIADB_DATABASE")
    ENABLE_BOCCO = os.getenv("ENABLE_BOCCO", "false").lower() == "true"
    BOCCO_REFRESH_TOKEN = os.getenv("BOCCO_REFRESH_TOKEN")
    BOCCO_ROOM_ID = os.getenv("BOCCO_ROOM_ID")
    JSON_AS_ASCII = False  # 日本語をエスケープせず返す

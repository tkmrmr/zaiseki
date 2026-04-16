import os
from pathlib import Path

import pymysql
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)


def get_db_connection() -> pymysql.connections.Connection:
    return pymysql.connect(
        init_command="SET time_zone = '+00:00'",  # セッションのタイムゾーンをUTCに設定
        host=os.getenv("MARIADB_HOST", "db"),
        user=os.getenv("MARIADB_USER"),
        password=os.getenv("MARIADB_PASSWORD"),
        database=os.getenv("MARIADB_DATABASE"),
        charset="utf8mb4",
    )

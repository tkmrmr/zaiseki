from typing import Optional

from flask import current_app, g
from vendor import pymysql


def get_db_connection() -> pymysql.Connection:
    if "db" not in g:
        g.db = pymysql.connect(
            init_command="SET time_zone = '+00:00'",  # セッションのタイムゾーンをUTCに設定
            host=current_app.config["DB_HOST"],
            user=current_app.config["DB_USER"],
            password=current_app.config["DB_PASSWORD"],
            database=current_app.config["DB_NAME"],
            charset="utf8mb4",
        )
    return g.db


def close_db(e: Optional[BaseException] = None) -> None:
    db = g.pop("db", None)

    if db is not None:
        db.close()


def init_app(app) -> None:
    app.teardown_appcontext(close_db)

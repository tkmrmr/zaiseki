from flask import current_app

from .. import pymysql


def get_db_connection() -> pymysql.connections.Connection:
    return pymysql.connect(
        init_command="SET time_zone = '+00:00'",  # セッションのタイムゾーンをUTCに設定
        host=current_app.config["DB_HOST"],
        user=current_app.config["DB_USER"],
        password=current_app.config["DB_PASSWORD"],
        database=current_app.config["DB_NAME"],
        charset="utf8mb4",
    )

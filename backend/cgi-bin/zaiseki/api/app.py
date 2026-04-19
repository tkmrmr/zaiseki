import os
from pathlib import Path

from common import register_error_handlers
from dotenv import load_dotenv
from flask import Flask
from routes.admin import bp as admin_bp
from routes.kiosk import bp as kiosk_bp
from routes.public import bp as public_bp

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)


def create_app() -> Flask:
    app = Flask(__name__)

    app.config["DB_HOST"] = os.getenv("MARIADB_HOST", "db")
    app.config["DB_USER"] = os.getenv("MARIADB_USER")
    app.config["DB_PASSWORD"] = os.getenv("MARIADB_PASSWORD")
    app.config["DB_NAME"] = os.getenv("MARIADB_DATABASE")
    app.config["ENABLE_BOCCO"] = os.getenv("ENABLE_BOCCO", "false").lower() == "true"
    app.config["BOCCO_REFRESH_TOKEN"] = os.getenv("BOCCO_REFRESH_TOKEN")
    app.config["BOCCO_ROOM_ID"] = os.getenv("BOCCO_ROOM_ID")

    app.register_blueprint(public_bp)
    app.register_blueprint(kiosk_bp)
    app.register_blueprint(admin_bp)
    app.config["JSON_AS_ASCII"] = False  # 日本語をエスケープせず返す
    register_error_handlers(app)

    return app

import sys

import pymysql
from flask import Flask
from routes.admin import bp as admin_bp
from routes.kiosk import bp as kiosk_bp
from routes.public import bp as public_bp
from werkzeug.exceptions import HTTPException
from werkzeug.sansio.response import Response

app = Flask(__name__)
app.register_blueprint(public_bp)
app.register_blueprint(kiosk_bp)
app.register_blueprint(admin_bp)
app.config["JSON_AS_ASCII"] = False  # 日本語をエスケープせず返す


@app.errorhandler(pymysql.Error)
def handle_db_error(error: Exception) -> tuple[dict, int]:
    print(error, file=sys.stderr)
    return {"ok": False, "error": "Database error"}, 500


@app.errorhandler(Exception)
def handle_internal_error(error: Exception) -> Response | tuple[dict, int]:
    if isinstance(error, HTTPException):
        return error.get_response()
    print(error, file=sys.stderr)
    return {"ok": False, "error": "Internal error"}, 500

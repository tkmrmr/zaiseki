import json
import sys
from typing import cast

import pymysql
from flask import Flask
from flask.typing import ResponseReturnValue
from werkzeug.exceptions import HTTPException
from werkzeug.wrappers.response import Response


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(pymysql.Error)
    def handle_db_error(error: Exception) -> tuple[dict, int]:
        print(error, file=sys.stderr)
        return {"ok": False, "error": "Database error"}, 500

    @app.errorhandler(HTTPException)
    def handle_http_error(error: Exception) -> ResponseReturnValue:
        http_error = cast(HTTPException, error)
        response = cast(Response, http_error.get_response())
        response.set_data(
            json.dumps(
                {"ok": False, "error": http_error.description},
                ensure_ascii=False,
            )
        )
        response.content_type = "application/json; charset=utf-8"
        return response

    @app.errorhandler(Exception)
    def handle_internal_error(error: Exception) -> tuple[dict, int]:
        print(error, file=sys.stderr)
        return {"ok": False, "error": "Internal error"}, 500

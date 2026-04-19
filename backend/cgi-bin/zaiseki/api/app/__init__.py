from flask import Flask

from .config import Config
from .error_handler import register_error_handlers
from .routes.admin import bp as admin_bp
from .routes.kiosk import bp as kiosk_bp
from .routes.public import bp as public_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    register_error_handlers(app)

    app.register_blueprint(public_bp)
    app.register_blueprint(kiosk_bp)
    app.register_blueprint(admin_bp)

    return app

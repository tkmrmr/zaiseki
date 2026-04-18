from flask import Flask
from routes.admin import bp as admin_bp
from routes.kiosk import bp as kiosk_bp
from routes.public import bp as public_bp

app = Flask(__name__)
app.register_blueprint(public_bp)
app.register_blueprint(kiosk_bp)
app.register_blueprint(admin_bp)
app.config["JSON_AS_ASCII"] = False  # 日本語をエスケープせず返す

from flask import Flask
from routes.public import bp as public_bp

app = Flask(__name__)
app.register_blueprint(public_bp)

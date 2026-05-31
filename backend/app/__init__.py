from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import init_database
from .routes.admin_routes import admin_bp
from .routes.auth_routes import auth_bp
from .routes.complaint_routes import complaint_bp
from .routes.health_routes import health_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)

    init_database(app.config["DATABASE_PATH"])

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(complaint_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    return app


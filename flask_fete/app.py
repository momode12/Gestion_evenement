# app.py
import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_cors import CORS
from .config import Config
from .database import ensure_database_exists
from .models import db
from .routes import create_routes

# 1. Créer la base de données automatiquement si elle n'existe pas
ensure_database_exists()

app = Flask(__name__)
app.config.from_object(Config)

raw_origins = os.getenv("FRONTEND_URL", "")
origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

if not origins:

    origins = ["*"]

print(f"[CORS] Origines autorisées: {origins}")

CORS(
    app,
    resources={r"/api/*": {"origins": origins}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

# 2. Initialiser SQLAlchemy
db.init_app(app)

# 3. Créer les tables automatiquement
with app.app_context():
    db.create_all()

create_routes(app)


@app.route("/")
def index():
    return {
        "status": "OK",
        "message": "API Flask opérationnelle"
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

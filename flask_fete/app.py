import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_cors import CORS
from config import Config
from models._init_ import db
from routes.__init__ import create_routes
from extensions import mail

app = Flask(__name__)
app.config.from_object(Config)

# Lire les domaines autorisés
origins = os.getenv("FRONTEND_URL", "").split(",")

CORS(
    app,
    resources={r"/api/*": {"origins": origins}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

# Initialisation
db.init_app(app)
mail.init_app(app)

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
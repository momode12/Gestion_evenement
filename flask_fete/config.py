# config.py
import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv("SECRET_KEY")
    SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY")

    # Resend
    RESEND_API_KEY = os.getenv("RESEND_API_KEY")
    RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")

    DEBUG = os.getenv("FLASK_DEBUG", "False") == "True"

    SESSION_COOKIE_NAME = "fete_session"
    SESSION_TYPE = "filesystem"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_COOKIE_SECURE = False  # True uniquement en production HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
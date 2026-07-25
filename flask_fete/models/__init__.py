# models/__init__.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import après la définition de db pour éviter les imports circulaires
from .client_model import Client
from .entree_sortie_model import EntreeSortie
from .utilisateur_model import Utilisateur

__all__ = ["db", "Client", "EntreeSortie", "Utilisateur"]
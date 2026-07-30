from .utilisateurs import utilisateur_bp
from .client import client_bp
from .entree_sortie import entree_sortie_bp


def create_routes(app):
    app.register_blueprint(utilisateur_bp)
    app.register_blueprint(client_bp)
    app.register_blueprint(entree_sortie_bp)

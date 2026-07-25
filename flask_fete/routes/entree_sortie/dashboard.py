from flask import jsonify
from services.entree_sortie_service import obtenir_donnees_dashboard


def get_dashboard_data():
    return jsonify(obtenir_donnees_dashboard())
from flask import request, jsonify
from services.utilisateur_service import creer_utilisateur


def create_utilisateur():
    data = request.get_json()
    creer_utilisateur(data)
    return jsonify({"message": "Inscription soumise pour validation par l'administrateur."}), 201
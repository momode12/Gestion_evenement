from flask import request, jsonify
from services.entree_sortie_service import autoriser_sortie


def update_sortie():
    data = request.get_json()
    resultat = autoriser_sortie(data.get("id_utilisateur"), data.get("cin_client"))
    return jsonify({"message": resultat["message"]}), resultat["code"]
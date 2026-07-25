from flask import request, jsonify
from services.entree_sortie_service import autoriser_entree


def update_entree():
    data = request.get_json()
    resultat = autoriser_entree(data.get("id_utilisateur"), data.get("cin_client"))
    return jsonify({"message": resultat["message"]}), resultat["code"]
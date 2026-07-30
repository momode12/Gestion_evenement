from flask import request, jsonify
from services.utilisateur_service import valider_utilisateur as valider_service


def valider_utilisateur(id_utilisateur):
    data = request.get_json()
    statut = data.get('statut')

    resultat = valider_service(id_utilisateur, statut)
    return jsonify({"message": resultat["message"]}), resultat["code"]

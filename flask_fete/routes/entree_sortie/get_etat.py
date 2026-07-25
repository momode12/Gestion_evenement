from flask import jsonify
from services.entree_sortie_service import obtenir_dernier_etat


def get_etat():
    try:
        dernier = obtenir_dernier_etat()

        if dernier:
            result = {
                "id_entree_sortie": dernier.id_entree_sortie,
                "cin_client": dernier.cin_client,
                "etat": dernier.etat,
                "date_heure": dernier.date_heure.isoformat() if dernier.date_heure else None
            }
            return jsonify(result), 200
        else:
            return jsonify({"message": "Aucun enregistrement trouvé"}), 200

    except Exception as e:
        print("Erreur lors de la récupération de l'état :", e)
        return jsonify({"error": "Erreur interne du serveur"}), 500
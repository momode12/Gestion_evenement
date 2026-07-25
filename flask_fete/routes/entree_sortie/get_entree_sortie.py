from flask import jsonify
from services.entree_sortie_service import lister_entrees_sorties


def get_entree_sortie():
    try:
        entree_sorties = lister_entrees_sorties()
        result = [
            {
                "id_entree_sortie": e.id_entree_sortie,
                "cin_client": e.cin_client,
                "nom": e.client.nom_client,
                "prenom": e.client.prenom_client,
                "etat": e.etat,
                "date_heure": e.date_heure.strftime("%Y-%m-%d %H:%M:%S")
            }
            for e in entree_sorties
        ]
        return jsonify(result)
    except Exception as ex:
        print(f">>> Erreur : {ex}")
        return jsonify({"error": str(ex)}), 500
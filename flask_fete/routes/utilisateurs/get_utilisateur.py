from flask import jsonify
from ...services.utilisateur_service import lister_utilisateurs


def get_utilisateurs():
    utilisateurs = lister_utilisateurs()
    return jsonify([
        {
            'id': u.id_utilisateur,
            'nom': u.nom_utilisateur,
            'prenom': u.prenom_utilisateur,
            'email': u.email_utilisateur,
            'role': u.role_utilisateur,
            'statut': u.statut_utilisateur
        }
        for u in utilisateurs
    ])

from flask import request, jsonify, session
from services.utilisateur_service import login as login_service


def login_utilisateur():
    data = request.get_json()
    email = data.get('email_utilisateur')
    mot_de_passe = data.get('mot_de_passe_utilisateur')

    resultat = login_service(email, mot_de_passe)

    if resultat["code"] == 200:
        utilisateur = resultat["utilisateur"]
        session['utilisateur_id'] = utilisateur.id_utilisateur
        session['role'] = utilisateur.role_utilisateur

        return jsonify({
            'message': 'Connexion réussie.',
            'id_utilisateur': utilisateur.id_utilisateur,
            'role_utilisateur': utilisateur.role_utilisateur
        }), 200

    return jsonify({'message': resultat["message"]}), resultat["code"]

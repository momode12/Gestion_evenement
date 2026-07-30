from werkzeug.security import generate_password_hash, check_password_hash
from ..models import db
from ..models.utilisateur_model import Utilisateur
from services.email_service import envoyer_email_admin, envoyer_email_utilisateur


def lister_utilisateurs():
    return Utilisateur.query.all()


def creer_utilisateur(data):
    mot_de_passe_hache = generate_password_hash(data['mot_de_passe_utilisateur'])

    nouvel_utilisateur = Utilisateur(
        nom_utilisateur=data['nom_utilisateur'],
        prenom_utilisateur=data['prenom_utilisateur'],
        email_utilisateur=data['email_utilisateur'],
        role_utilisateur=data['role_utilisateur'],
        statut_utilisateur='En attente',
        mot_de_passe_utilisateur=mot_de_passe_hache
    )

    db.session.add(nouvel_utilisateur)
    db.session.commit()

    envoyer_email_admin(nouvel_utilisateur)

    return nouvel_utilisateur


def valider_utilisateur(id_utilisateur, statut):
    if statut not in ['En attente', 'Accepté', 'Refusé']:
        return {"code": 400, "message": 'Statut invalide. Utilisez "En attente", "Accepté" ou "Refusé".'}

    utilisateur = Utilisateur.query.get(id_utilisateur)
    if not utilisateur:
        return {"code": 404, "message": "Utilisateur non trouvé."}

    if statut == 'Refusé':
        try:
            db.session.delete(utilisateur)
            db.session.commit()
            envoyer_email_utilisateur(utilisateur, statut)
            return {"code": 200, "message": "Utilisateur refusé et supprimé avec succès."}
        except Exception:
            db.session.rollback()
            return {"code": 500, "message": "Erreur lors de la suppression de l'utilisateur."}
    else:
        utilisateur.statut_utilisateur = statut
        db.session.commit()
        envoyer_email_utilisateur(utilisateur, statut)
        return {"code": 200, "message": f'Utilisateur mis à jour avec le statut "{statut}" avec succès.'}


def login(email, mot_de_passe):
    utilisateur = Utilisateur.query.filter_by(email_utilisateur=email).first()

    if utilisateur and check_password_hash(utilisateur.mot_de_passe_utilisateur, mot_de_passe):
        if utilisateur.statut_utilisateur != 'Accepté':
            return {"code": 403, "message": "Votre inscription n'a pas été acceptée."}
        return {"code": 200, "utilisateur": utilisateur}

    return {"code": 401, "message": "Email ou mot de passe incorrect."}

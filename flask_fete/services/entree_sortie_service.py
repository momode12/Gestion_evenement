from models import db
from models.entree_sortie_model import EntreeSortie
from models.utilisateur_model import Utilisateur


def autoriser_entree(id_utilisateur, cin_client):
    utilisateur = Utilisateur.query.get(id_utilisateur)
    if not utilisateur or utilisateur.role_utilisateur != "securite_entree":
        return {"code": 403, "message": "Accès refusé. Rôle non autorisé."}

    entree = EntreeSortie.query.filter_by(cin_client=cin_client).first()
    if not entree:
        return {"code": 404, "message": "Client non trouvé dans la base d'entrée."}

    if entree.etat == "entree":
        return {"code": 400, "message": "Le client est déjà entré. Accès refusé."}

    entree.etat = "entree"
    db.session.commit()
    return {"code": 200, "message": "Entrée autorisée. Bienvenue dans la fête."}


def autoriser_sortie(id_utilisateur, cin_client):
    utilisateur = Utilisateur.query.get(id_utilisateur)
    if not utilisateur or utilisateur.role_utilisateur != "securite_sortie":
        return {"code": 403, "message": "Accès refusé. Rôle non autorisé."}

    entree = EntreeSortie.query.filter_by(cin_client=cin_client).first()
    if not entree:
        return {"code": 404, "message": "Client non trouvé dans la base d'entrée."}

    if entree.etat == "sortie":
        return {"code": 400, "message": "Le client est déjà sorti. Action inutile."}

    entree.etat = "sortie"
    db.session.commit()
    return {"code": 200, "message": "Sortie enregistrée. À bientôt."}


def obtenir_dernier_etat():
    return EntreeSortie.query.order_by(EntreeSortie.id_entree_sortie.desc()).first()


def lister_entrees_sorties():
    return EntreeSortie.query.all()


def supprimer_entree_sortie(id_entree_sortie):
    entree_sortie = EntreeSortie.query.get(id_entree_sortie)
    if not entree_sortie:
        return None
    db.session.delete(entree_sortie)
    db.session.commit()
    return entree_sortie


def obtenir_donnees_dashboard():
    from models.client_model import Client
    from sqlalchemy import func

    nombre_clients = Client.query.count()
    nombre_utilisateurs = Utilisateur.query.count()
    nombre_entrees_sorties = EntreeSortie.query.count()

    histogramme_raw = (
        EntreeSortie.query
        .with_entities(func.extract('dow', EntreeSortie.date_heure).label('jour_semaine'), func.count().label('total'))
        .filter(EntreeSortie.etat == 'entree')
        .group_by('jour_semaine')
        .order_by('jour_semaine')
        .all()
    )

    jours_semaine = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    histogramme = [
        {
            "jour": jours_semaine[int(float(row.jour_semaine))],
            "entrees": int(row.total)
        }
        for row in histogramme_raw
    ]

    return {
        "nombre_clients": nombre_clients,
        "nombre_utilisateurs": nombre_utilisateurs,
        "nombre_entrees_sorties": nombre_entrees_sorties,
        "histogramme": histogramme
    }
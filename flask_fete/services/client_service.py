from datetime import datetime
from ..models import db, Client
from models.entree_sortie_model import EntreeSortie
from services.qrcode_service import generer_qrcode_avec_photo, construire_texte_qr
from services.email_service import envoyer_email_client_creation, envoyer_email_client_update


def creer_client(data, photo_bytes):
    qr_text = construire_texte_qr(
        data['cin_client'], data['nom_client'], data['prenom_client'],
        data['email_client'], data['adresse_client'], data['telephone_client'],
        data['paf_client']
    )

    qr_code_bytes = generer_qrcode_avec_photo(qr_text, photo_bytes)

    new_client = Client(
        cin_client=data['cin_client'],
        id_utilisateur=int(data['id_utilisateur']),
        photo_client=photo_bytes,
        nom_client=data['nom_client'],
        prenom_client=data['prenom_client'],
        email_client=data['email_client'],
        adresse_client=data['adresse_client'],
        telephone_client=data['telephone_client'],
        paf_client=int(data['paf_client']),
        codeqr_client=qr_text,
        date_creation=datetime.utcnow()
    )
    db.session.add(new_client)
    db.session.commit()

    sortie = EntreeSortie(
        cin_client=new_client.cin_client,
        etat='sortie',
        date_heure=datetime.utcnow()
    )
    db.session.add(sortie)
    db.session.commit()

    envoyer_email_client_creation(data['email_client'], qr_code_bytes)

    return new_client


def modifier_client(cin_client, data, photo_bytes=None):
    client = Client.query.filter_by(cin_client=cin_client).first_or_404()

    if photo_bytes is None:
        photo_bytes = client.photo_client  # Réutiliser la photo existante

    client.nom_client = data.get('nom_client', client.nom_client)
    client.prenom_client = data.get('prenom_client', client.prenom_client)
    client.email_client = data.get('email_client', client.email_client)
    client.adresse_client = data.get('adresse_client', client.adresse_client)
    client.telephone_client = data.get('telephone_client', client.telephone_client)
    client.paf_client = int(data.get('paf_client', client.paf_client))
    client.id_utilisateur = int(data.get('id_utilisateur', client.id_utilisateur))
    client.photo_client = photo_bytes
    client.date_creation = datetime.utcnow()

    qr_text = construire_texte_qr(
        client.cin_client, client.nom_client, client.prenom_client,
        client.email_client, client.adresse_client, client.telephone_client,
        client.paf_client
    )
    client.codeqr_client = qr_text

    qr_code_bytes = generer_qrcode_avec_photo(qr_text, photo_bytes)

    db.session.commit()

    envoyer_email_client_update(client.email_client, qr_code_bytes)

    return client


def supprimer_client(cin_client):
    client = Client.query.get(cin_client)
    if not client:
        return None
    db.session.delete(client)
    db.session.commit()
    return client


def lister_clients():
    return Client.query.all()


def filtrer_clients_par_date(start_date_str, end_date_str):
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    end_date = end_date.replace(hour=23, minute=59, second=59)

    return Client.query.filter(
        Client.date_creation >= start_date,
        Client.date_creation <= end_date
    ).all()

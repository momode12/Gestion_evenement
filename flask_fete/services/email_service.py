# email_service.py
import os
import base64
import requests

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def _envoyer(destinataire, sujet, corps, qr_code_bytes=None):
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }

    payload = {
        "sender": {"email": MAIL_DEFAULT_SENDER},
        "to": [{"email": destinataire}],
        "subject": sujet,
        "textContent": corps,
    }

    if qr_code_bytes:
        payload["attachment"] = [{
            "name": "code_qr.png",
            "content": base64.b64encode(qr_code_bytes).decode("utf-8"),
        }]

    print(f"[BREVO] Clé API présente : {bool(BREVO_API_KEY)}")
    print(f"[BREVO] Sender utilisé : {MAIL_DEFAULT_SENDER}")
    print(f"[BREVO] Envoi vers {destinataire}...")

    response = requests.post(BREVO_API_URL, json=payload, headers=headers)

    print(f"[BREVO] Status: {response.status_code}")
    print(f"[BREVO] Réponse: {response.text}")

    if response.status_code >= 400:
        print(f"Erreur lors de l'envoi de l'email via Brevo : {response.status_code} - {response.text}")
        response.raise_for_status()

    return response.json()

def envoyer_email_client_creation(email, qr_code_bytes):
    corps = (
        "Bonjour,\n\n"
        "Merci pour votre inscription. Vous trouverez en pièce jointe votre code QR personnalisé avec votre photo.\n"
        "Veuillez le conserver précieusement.\n\n"
        "Cordialement,\nL'équipe."
    )
    _envoyer(email, "Votre Code QR d'inscription", corps, qr_code_bytes)


def envoyer_email_client_update(email, qr_code_bytes):
    corps = (
        "Bonjour,\n\n"
        "Vos informations ont été mises à jour. Vous trouverez en pièce jointe votre nouveau code QR personnalisé avec votre photo.\n"
        "Veuillez le conserver précieusement.\n\n"
        "Cordialement,\nL'équipe."
    )
    _envoyer(email, "Votre Code QR mis à jour", corps, qr_code_bytes)


def envoyer_email_admin(utilisateur, nombre_en_attente=None):
    WEB_URL = "https://fete-be.vercel.app/"

    info_attente = ""
    if nombre_en_attente is not None and nombre_en_attente > 1:
        info_attente = f"\n⚠️ Il y a actuellement {nombre_en_attente} comptes en attente de validation.\n"

    corps = f"""
Un nouvel utilisateur a demandé une inscription.

Nom : {utilisateur.nom_utilisateur}
Prénom : {utilisateur.prenom_utilisateur}
Email : {utilisateur.email_utilisateur}
Rôle : {utilisateur.role_utilisateur}
{info_attente}
Merci de valider ou refuser cette inscription via l'interface d'administration :
{WEB_URL}
"""
    _envoyer("heritianajulien12@gmail.com", "Nouvelle demande d'inscription", corps)


def envoyer_email_utilisateur(utilisateur, statut):
    WEB_URL = "https://fete-be.vercel.app/"
    APK_URL = "https://expo.dev/accounts/julien586s-team/projects/gestion-evenement/builds/afe91842-228f-4b91-8826-da7a9c38d5e8"  # à remplacer par un lien plus stable si possible

    if statut == 'Accepté':
        if utilisateur.role_utilisateur in ('admin', 'responsable'):
            corps = f"""
Bonjour {utilisateur.prenom_utilisateur},

Votre inscription a été acceptée ! 🎉
Vous pouvez maintenant vous connecter à la plateforme via le lien suivant :

{WEB_URL}

Merci et bienvenue !
"""
        else:  # securite_entree, securite_sortie
            corps = f"""
Bonjour {utilisateur.prenom_utilisateur},

Votre inscription a été acceptée ! 🎉
Pour votre rôle, la connexion se fait via l'application mobile. Téléchargez-la ici :

{APK_URL}

Merci et bienvenue !
"""
    else:
        corps = f"""
Bonjour {utilisateur.prenom_utilisateur},

Nous sommes désolés, mais votre demande d'inscription a été refusée.

Pour plus d'informations, veuillez contacter l'administrateur.

Merci.
"""
    _envoyer(utilisateur.email_utilisateur, "Résultat de votre inscription", corps)
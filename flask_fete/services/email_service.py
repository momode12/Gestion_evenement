import os
import base64
import resend

resend.api_key = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")


def _envoyer(destinataire, sujet, corps, qr_code_bytes=None):
    params = {
        "from": FROM_EMAIL,
        "to": [destinataire],
        "subject": sujet,
        "text": corps,
    }

    if qr_code_bytes:
        params["attachments"] = [{
            "filename": "code_qr.png",
            "content": base64.b64encode(qr_code_bytes).decode("utf-8"),
        }]

    resend.Emails.send(params)


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


def envoyer_email_admin(utilisateur):
    corps = f"""
Un nouvel utilisateur a demandé une inscription.

Nom : {utilisateur.nom_utilisateur}
Prénom : {utilisateur.prenom_utilisateur}
Email : {utilisateur.email_utilisateur}
Rôle : {utilisateur.role_utilisateur}

Merci de valider ou refuser cette inscription via l'interface d'administration.
"""
    _envoyer("heritianajulien45@gmail.com", "Nouvelle demande d'inscription", corps)


def envoyer_email_utilisateur(utilisateur, statut):
    if statut == 'accepté':
        corps = f"""
Bonjour {utilisateur.prenom_utilisateur},

Votre inscription a été acceptée ! 🎉
Vous pouvez maintenant vous connecter à la plateforme.

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
# seed_admin.py
from app import app  # adapte selon le nom de ton fichier principal Flask
from models import db
from models.utilisateur_model import Utilisateur
from werkzeug.security import generate_password_hash

with app.app_context():
    email = "admin@gmail.com"

    existant = Utilisateur.query.filter_by(email_utilisateur=email).first()

    if existant:
        print(f"Un utilisateur avec l'email {email} existe déjà (id={existant.id_utilisateur}).")
    else:
        admin = Utilisateur(
            nom_utilisateur="Admin",
            prenom_utilisateur="Admin",
            email_utilisateur=email,
            role_utilisateur="admin",
            statut_utilisateur="Accepté",
            mot_de_passe_utilisateur=generate_password_hash("admin")
        )

        db.session.add(admin)
        db.session.commit()

        print(f"Compte admin créé avec succès : {email}")
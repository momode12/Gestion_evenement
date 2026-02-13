🏪 Stock & Sales Manager – Grossiste PPN (Mananjary)

Application web de gestion de stock et de ventes destinée à un grossiste PPN (Produits de Première Nécessité) situé à Mananjary.
Le système permet de gérer les produits, les entrées de stock, les ventes, les clients et les rapports financiers.

🚀 Stack Technique
Frontend

⚛️ React + TypeScript (TSC)

Axios (API calls)

React Router

TailwindCSS ou Bootstrap

Backend

🐍 Python + Flask

Flask-JWT-Extended (authentification)

Flask-SQLAlchemy (ORM)

Base de données

🐘 PostgreSQL

Déploiement

Frontend : Vercel

Backend : Render

Base de données : PostgreSQL (Render ou Neon)

📌 Objectifs du Projet

Digitaliser la gestion du stock

Réduire les erreurs manuelles

Suivre les ventes journalières

Générer des rapports financiers

Alerter en cas de rupture de stock

🧩 Fonctionnalités
🔐 1. Authentification & Rôles

Inscription / Connexion

JWT Authentication

Rôles :

Admin

Caissier

Gestionnaire

📦 2. Gestion des Produits

Ajouter un produit

Modifier un produit

Supprimer un produit

Catégories (Riz, Huile, Sucre, Savon, etc.)

Prix d’achat

Prix de vente

Quantité en stock

Seuil minimum d’alerte

📥 3. Gestion des Entrées de Stock

Enregistrer un approvisionnement

Fournisseur

Quantité reçue

Prix d’achat

Mise à jour automatique du stock

🛒 4. Gestion des Ventes

Créer une vente

Ajouter plusieurs produits

Calcul automatique du total

Mise à jour automatique du stock

Impression de facture

Historique des ventes

👥 5. Gestion des Clients

Ajouter un client

Vente à crédit

Historique des dettes

Suivi des paiements

📊 6. Tableau de Bord

Total ventes du jour

Produits en rupture

Bénéfice journalier

Graphique des ventes

📈 7. Rapports

Rapport journalier

Rapport mensuel

Rapport annuel

Export PDF
🛠️ Architecture
Frontend (React TS)
        ↓ API REST
Backend (Flask)
        ↓
PostgreSQL

⚙️ Installation Locale
1️⃣ Backend (Flask)
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run

2️⃣ Frontend (React)
npm install
npm run dev

🌍 Déploiement
🔹 Backend sur Render

Connecter GitHub

Ajouter variables d’environnement :

DATABASE_URL

SECRET_KEY

JWT_SECRET_KEY

🔹 Frontend sur Vercel

Connecter GitHub

Ajouter :

VITE_API_URL

🔐 Sécurité

Hash password (bcrypt)

JWT sécurisé

Validation des données

Protection CORS

💡 Améliorations Futures

Version mobile (React Native)

Scanner code-barres

Notifications SMS

Multi-magasins

IA pour prédiction de rupture de stock

🎯 Avantages pour un Grossiste à Mananjary

Meilleur contrôle du stock

Réduction des pertes

Suivi précis des crédits clients

Vision claire du bénéfice réel

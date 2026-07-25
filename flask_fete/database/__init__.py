# database/__init__.py
import os
import psycopg2
from psycopg2 import sql
from urllib.parse import urlparse


def ensure_database_exists():
    """
    Vérifie si la base de données cible existe, et la crée si nécessaire.
    Se connecte à la base 'postgres' par défaut (toujours présente) pour
    exécuter le CREATE DATABASE, car on ne peut pas créer une base
    en étant déjà connecté dessus.
    """
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL n'est pas défini dans les variables d'environnement")

    parsed = urlparse(database_url)
    db_name = parsed.path.lstrip("/")

    admin_conn = psycopg2.connect(
        dbname="postgres",
        user=parsed.username,
        password=parsed.password,
        host=parsed.hostname,
        port=parsed.port or 5432,
    )
    admin_conn.autocommit = True

    try:
        with admin_conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
            exists = cur.fetchone()

            if not exists:
                cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))
                print(f">>> Base de données '{db_name}' créée automatiquement.")
            else:
                print(f">>> Base de données '{db_name}' déjà existante.")
    finally:
        admin_conn.close()
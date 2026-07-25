from flask import request, jsonify
import traceback
from models import db
from services.client_service import creer_client


def create_client():
    try:
        data = request.form
        photo_bytes = request.files['photo_client'].read()

        creer_client(data, photo_bytes)

        return jsonify({'message': 'Client ajouté avec succès, QR code envoyé par email, et sortie enregistrée.'}), 201

    except Exception as e:
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
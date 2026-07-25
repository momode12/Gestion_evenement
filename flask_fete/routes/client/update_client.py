from flask import request, jsonify
import traceback
from models import db
from services.client_service import modifier_client


def update_client(cin_client):
    try:
        data = request.form
        photo = request.files.get('photo_client')
        photo_bytes = photo.read() if photo else None

        modifier_client(cin_client, data, photo_bytes)

        return jsonify({'message': 'Client modifié avec succès et nouveau QR code envoyé par email'}), 200

    except Exception as e:
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
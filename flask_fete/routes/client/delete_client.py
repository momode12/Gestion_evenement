from flask import jsonify
from models import db
from services.client_service import supprimer_client


def delete_client(cin_client):
    try:
        client = supprimer_client(cin_client)
        if not client:
            return jsonify({'error': f'Client avec cin_client {cin_client} non trouvé'}), 404

        return jsonify({'message': f'Client avec cin_client {cin_client} supprimé avec succès'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la suppression du client: {str(e)}'}), 500
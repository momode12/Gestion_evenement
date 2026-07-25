from flask import jsonify
from models import db
from services.entree_sortie_service import supprimer_entree_sortie


def delete_entree_sortie(id_entree_sortie):
    try:
        entree_sortie = supprimer_entree_sortie(id_entree_sortie)
        if not entree_sortie:
            return jsonify({'error': f'Entrée/Sortie avec id {id_entree_sortie} non trouvée'}), 404

        return jsonify({'message': f'Entrée/Sortie avec id {id_entree_sortie} supprimé avec succès'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la suppression: {str(e)}'}), 500
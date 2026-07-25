from flask import request, jsonify
from services.client_service import filtrer_clients_par_date as filtrer_service

def filtrer_clients_par_date():
    try:
        start_date_str = request.args.get('start')
        end_date_str = request.args.get('end')

        if not start_date_str or not end_date_str:
            return jsonify({'error': 'Les paramètres start et end sont requis'}), 400

        clients = filtrer_service(start_date_str, end_date_str)

        resultats = []
        for client in clients:
            resultats.append({
                'cin_client': client.cin_client,
                'nom_client': client.nom_client,
                'prenom_client': client.prenom_client,
                'email_client': client.email_client,
                'paf_client': client.paf_client,
                'date_creation': client.date_creation.strftime('%Y-%m-%d %H:%M:%S')
            })

        return jsonify(resultats), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
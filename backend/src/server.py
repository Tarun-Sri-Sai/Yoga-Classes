from src.mongo_app import MongoApp
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os


server = Flask(__name__)
CORS(server)
m_app = MongoApp()
load_dotenv()


@server.route('/signup', methods=['POST'])
def signup_endpoint():
    return jsonify({ 'message': m_app.signup(request.get_json()) }), 200


@server.route('/login', methods=['POST'])
def login_endpoint():
    message, token = m_app.login(request.get_json())
    return jsonify({ 'message': message, 'token': token }), 200


@server.route('/logout', methods=['POST'])
def logout_endpoint():
    return jsonify({ 'message': m_app.logout(request.get_json())}), 200


@server.route('/user-details', methods=['GET'])
def user_details_endpoint():
    message, user_details = m_app.user_details({ 'token': request.headers['token']})
    return jsonify({ 'message': message, 'userDetails': user_details }), 200


@server.route('/enroll', methods=['POST'])
def enroll_endpoint():
    return jsonify({ 'message': m_app.enroll(request.get_json())}), 200


@server.route('/pay-due', methods=['POST'])
def pay_due_endpoint():
    return jsonify({ 'message': m_app.pay_due(request.get_json())}), 200


@server.route('/update', methods=['POST'])
def update_endpoint():
    return jsonify({ 'message': m_app.update(request.get_json())}), 200


if __name__ == '__main__':
    FLASK_HOST = os.environ['FLASK_HOST']
    FLASK_PORT = os.environ['FLASK_PORT']

    server.run(host=FLASK_HOST, port=FLASK_PORT, debug=True)

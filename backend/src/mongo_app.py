from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from re import match
from hashlib import sha256
from time import time
from dateutils import relativedelta
import os


load_dotenv()


class MongoApp:
    def __init__(self):
        self._mongo_client = MongoClient(os.environ['MONGODB_CONNECTION_STRING'])
        self._db = self._mongo_client['yoga_classes']
        self._user_collection = self._db['user']
        self._token_collection = self._db['tokens']

    @staticmethod
    def _any_empty_input(data):
        return any(not value.strip() for value in data.values())
    
    @staticmethod
    def _expired(token_timestamp):
        return int(time()) - token_timestamp > 3600
    
    @staticmethod
    def _generate_token(username, timestamp):
        seed_string = username + timestamp
        return sha256(seed_string.encode('utf-8')).hexdigest()
    
    def _update_dues(self, username):
        full_user_details = self._user_collection.find_one({'username': username})
        dues_list = full_user_details['dues_list']

        most_recent_month = dues_list[-1]['date']
        current_month = MongoApp._get_current_month()

        while most_recent_month < current_month:
            next_month = (datetime.strptime(most_recent_month, '%Y-%m') + relativedelta(months=1)).strftime('%Y-%m')

            dues_list.append({
                'date': next_month,
                'amount': 500,
                'status': 'unpaid'
            })
        full_user_details['dues_list'] = dues_list
        self._user_collection.find_one_and_replace({'username': username}, full_user_details)


    def login(self, data):
        if MongoApp._any_empty_input(data):
            return 'One or more of the fields is empty', ''
        
        existing_user = self._user_collection.find_one({'username': data['username']})
        if not existing_user:
            return 'Username not found', ''
        
        hashed_password = MongoApp._hash_password(data['password'])
        if hashed_password != existing_user['password']:
            return 'Wrong password', ''
        
        existing_token = self._token_collection.find_one({'username': data['username']})

        if not existing_token or MongoApp._expired(existing_token['timestamp']):
            current_timestamp = int(time())
            token_details = {
                'token': MongoApp._generate_token(data['username'], str(current_timestamp)),
                'timestamp': current_timestamp,
                'username': data['username']
            }

            if not existing_token:
                self._token_collection.insert_one(token_details)
            else:
                self._token_collection.find_one_and_replace({'username': data['username']}, token_details)

        existing_token = self._token_collection.find_one({'username': data['username']})

        self._update_dues(data['username'])

        return 'Success', existing_token['token']
    
    @staticmethod
    def _calculate_age(dob):
        dob_datetime = datetime.strptime(dob, '%Y-%m-%d')
        today = datetime.today()
        age = today.year - dob_datetime.year - ((today.month, today.day) < (dob_datetime.month, dob_datetime.day))
        return age
    

    @staticmethod
    def _is_valid(username):
        return match(r'^[a-zA-Z0-9_]+$', username) is not None
    

    @staticmethod
    def _hash_password(password):
        return sha256(password.encode('utf-8')).hexdigest()
    

    @staticmethod
    def _get_current_month():
        return datetime.now().strftime('%Y-%m')

    
    def signup(self, data):
        if MongoApp._any_empty_input(data):
            return 'One or more of the fields is empty'
        
        age = MongoApp._calculate_age(data['dob'])
        if age < 18 or age > 65:
            return 'Age is not between 18 and 65, you are not allowed'
        
        if not MongoApp._is_valid(data['username']):
            return 'Invalid username, only use letters, numbers and underscores'

        existing_user = self._user_collection.find_one(({'username': data['username']}))
        if existing_user:
            return 'Username already exists'
        
        hashed_password = MongoApp._hash_password(data['password'])
        
        user_details = {
            'username': data['username'],
            'name': data['name'],
            'age': age,
            'password': hashed_password,
            'time_slot': '',
            'enrolled': False,
            'enrolled_date': '',
            'dues_list': [
                {
                    'date': MongoApp._get_current_month(),
                    'amount': 500,
                    'status': 'unpaid'
                }
            ]
        }

        self._user_collection.insert_one(user_details)
        return 'Success'
    
    def logout(self, data):
        existing_token = self._token_collection.find_one(data['token'])
        if not existing_token:
            return 'Already logged out'
        if MongoApp._expired(existing_token['timestamp']):
            self._token_collection.find_one_and_delete({'token': existing_token['token']})
            return 'Invalid token'
        self._token_collection.find_one_and_delete({'token': existing_token['token']})
        return 'Success'
    
    @staticmethod
    def _updated_dues(dues_list):
        return [{
            'date': due['date'],
            'amount': due['amount']
        } for due in dues_list if due['status'] != 'paid']
    
    def user_details(self, data):
        existing_token = self._token_collection.find_one({'token': data['token']})

        if not existing_token:
            return 'Invalid token'
        
        if MongoApp._expired(existing_token['timestamp']):
            self._token_collection.find_one_and_delete({'token': data['token']})
            return 'Invalid token'
        
        username = self._token_collection.find_one({'token': existing_token['token']})['username']
        full_user_details = self._user_collection.find_one({'username': username})

        return 'Success', { 
            'name': full_user_details['name'], 
            'isEnrolled': full_user_details['enrolled'], 
            'timeSlot': full_user_details['time_slot'], 
            'duesList': MongoApp._updated_dues(full_user_details['dues_list'])
        }
    
    def enroll(self, data):
        if MongoApp._any_empty_input(data):
            return 'One or more of the fields is empty'

        existing_token = self._token_collection.find_one({'token': data['token']})

        if not existing_token:
            return 'Invalid token'
        
        if MongoApp._expired(existing_token['timestamp']):
            self._token_collection.find_one_and_delete({'token': data['token']})
            return 'Invalid token'
        
        username = self._token_collection.find_one({'token': existing_token['token']})['username']
        full_user_details = self._user_collection.find_one({'username': username})

        full_user_details['enrolled'] = True
        full_user_details['enrolled_date'] = data['date']
        full_user_details['time_slot'] = data['timings']

        self._user_collection.find_one_and_replace({'username': username}, full_user_details)
        return 'Success'
    
    @staticmethod
    def _find_in_list_and_mark_status(items, attribute, attribute_value):
        for item in items:
            if item[attribute] == attribute_value:
                item['status'] = 'paid'
                break
        return items

    def pay_due(self, data):
        existing_token = self._token_collection.find_one({'token': data['token']})

        if not existing_token:
            return 'Invalid token'
        
        if MongoApp._expired(existing_token['timestamp']):
            self._token_collection.find_one_and_delete({'token': data['token']})
            return 'Invalid token'
        
        username = self._token_collection.find_one({'token': existing_token['token']})['username']
        full_user_details = self._user_collection.find_one({'username': username})


        full_user_details['dues_list'] = MongoApp._find_in_list_and_mark_status(
            full_user_details['dues_list'], 'date', data['dueDetails']['date'])
        self._user_collection.find_one_and_replace({'username': username}, full_user_details) 
        return 'Success'

    def update(self, data):
        if MongoApp._any_empty_input(data):
            return 'One or more of the fields is empty'
        
        existing_token = self._token_collection.find_one({'token': data['token']})

        if not existing_token:
            return 'Invalid token'
        
        if MongoApp._expired(existing_token['timestamp']):
            self._token_collection.find_one_and_delete({'token': data['token']})
            return 'Invalid token'
        
        username = self._token_collection.find_one({'token': existing_token['token']})['username']
        full_user_details = self._user_collection.find_one({'username': username})

        if full_user_details['time_slot'] == data['timings']:
            return 'Already chose this timeslot'
        
        full_user_details['time_slot'] = data['timings']
        self._user_collection.find_one_and_replace({'username': username}, full_user_details)
        return 'Success'

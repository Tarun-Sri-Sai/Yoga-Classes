class MongoApp:
    def __init__(self):
        pass

    def login(self, data):
        print(f'login({data = })')
        return 'Success', '0'
    
    def signup(self, data):
        print(f'signup({data = })')
        return 'Success'
    
    def logout(self, data):
        print(f'logout({data = })')
        return 'Success'
    
    def user_details(self, data):
        print(f'user_details({data = })')
        return 'Success', { 
            'name': 'Name', 
            'isEnrolled': True, 
            'timeSlot': '0', 
            'duesList': [{'billingDate': '2024-12', 'billingAmount': '500'}] 
        }
    
    def enroll(self, data):
        print(f'enroll({data = })')
        return 'Success'

    def pay_due(self, data):
        print(f'pay_due({data = })')
        return 'Success'

    def update(self, data):
        print(f'update({data = })')
        return 'Success'

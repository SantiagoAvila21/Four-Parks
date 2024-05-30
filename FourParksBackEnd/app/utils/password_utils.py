import random
import string

def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for i in range(length))
    return password

def generate_verification_code(length=6):
    digits = string.digits
    code = ''.join(random.choice(digits) for i in range(length))
    return code
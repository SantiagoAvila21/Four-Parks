from app.config import Config
import psycopg2

def get_db_connection():
    return psycopg2.connect(Config.DATABASE_URL)
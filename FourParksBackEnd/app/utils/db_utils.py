import psycopg2
from psycopg2 import pool
import os

class DatabaseConnection:
    __instance = None

    @staticmethod
    def get_instance():
        """ Static access method. """
        if DatabaseConnection.__instance is None:
            DatabaseConnection()
        return DatabaseConnection.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if DatabaseConnection.__instance is not None:
            raise Exception("This class is a singleton!")
        else:
            try:
                """ self.connection_pool = psycopg2.pool.SimpleConnectionPool(
                    minconn=1,
                    maxconn=10,
                    dsn=os.getenv('DATABASE_URL')
                ) """
                self.connection_pool = psycopg2.pool.SimpleConnectionPool(1, 20,
                    user=os.getenv("DB_USER"),
                    password=os.getenv("DB_PASSWORD"),
                    host=os.getenv("DB_HOST"),
                    port=os.getenv("DB_PORT"),
                    database=os.getenv("DB_NAME")
                )
                DatabaseConnection.__instance = self
            except Exception as e:
                raise Exception(f"Error initializing connection pool: {e}")

    def get_connection(self):
        try:
            return self.connection_pool.getconn()
        except Exception as e:
            raise Exception(f"Error getting connection: {e}")

    def release_connection(self, connection):
        try:
            self.connection_pool.putconn(connection)
        except Exception as e:
            raise Exception(f"Error releasing connection: {e}")

    def close_all_connections(self):
        try:
            self.connection_pool.closeall()
        except Exception as e:
            raise Exception(f"Error closing all connections: {e}")

class DatabaseFacade:
    @staticmethod
    def execute_query(query, params=None):
        db_instance = DatabaseConnection.get_instance()
        conn = db_instance.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(query, params)
                if query.strip().upper().startswith("SELECT"):
                    result = cur.fetchall()
                    return result
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            db_instance.release_connection(conn)

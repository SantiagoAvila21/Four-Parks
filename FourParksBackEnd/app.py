import os 
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, jsonify

load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)


@app.get("/")
def home():
    return "hello world"

SELECT_ALL_TIPODOC = "SELECT * FROM tipo_documento;"

@app.route("/api/tipodoc", methods=["GET"])
def get_all_tipodoc():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SELECT_ALL_TIPODOC)
            users = cursor.fetchall()
            if users:
                result = []
                for user in users:
                    result.append({"id": user[0], "tipodocs": user[1]})
                return jsonify(result)
            else:
                return jsonify({"error": f"Users not found."}), 404
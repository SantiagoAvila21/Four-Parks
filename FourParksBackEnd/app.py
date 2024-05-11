import os 
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.security import check_password_hash
from flask_cors import CORS
import hashlib

load_dotenv()

# Create the Flask application
app = Flask(__name__)
CORS(app)
# Load Database URL from .env
url = os.getenv("DATABASE_URL")
# Connect to the DB
connection = psycopg2.connect(url)


# Define a route for the root URL
@app.route("/")
def home():
    return "Hola Mundo desde Flask!"

SELECT_ALL_TIPODOC = "SELECT * FROM tipo_documento;"

@app.route("/api/tipodoc", methods=["GET"])
def get_all_tipodoc():
    connection = psycopg2.connect(url)
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SELECT_ALL_TIPODOC)
            users = cursor.fetchall()
            if users:
                result = []
                for user in users:
                    result.append({"id": user[0], "tipodocs": user[1]})
                    cursor.close()
                return jsonify(result)
            else:
                cursor.close()
                return jsonify({"error": f"Users not found."}), 404

@app.route("/register", methods=["POST"])
def register():
    try:
        connection = psycopg2.connect(url)
        data = request.get_json()
        cursor = connection.cursor()
        # Obtener el número total de usuarios en la tabla usuario
        cursor.execute("SELECT COUNT(idusuario) FROM usuario")
        total_usuarios = cursor.fetchone()[0]

        # Calcular el nuevo idusuario
        nuevo_idusuario = 'P' + str(total_usuarios + 1)

        sql_query ="""
            INSERT INTO usuario (idusuario, idtipousuario, idtipodocumento, nombreusuario, numdocumento, contrasenia, puntosacumulados, correoelectronico)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
        values = (nuevo_idusuario, data['idtipousuario'], data['idtipodocumento'], data['nombreusuario'], 
                    data['numdocumento'], data['contrasenia'], data['puntosacumulados'], data['correoelectronico'])
        print(values)
        cursor.execute(sql_query, values)
        connection.commit()
        # Close the connection
        cursor.close()
        connection.close()
        return jsonify({"message": "Usuario insertado con éxito"}), 201  
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/login", methods=["POST"])
def login():
    # Extract email and password from POST request
    data = request.get_json()
    email = data.get('correoelectronico')
    password = data.get('contrasenia')
    if not email or not password:
        return jsonify({"error": "Email y contraseña requeridos"}), 400
    
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(url)

        cur = conn.cursor()

        # Query to find user by email
        cur.execute("SELECT contrasenia, nombreusuario FROM usuario WHERE correoelectronico = %s", (email,))
        user_password = cur.fetchone()    
        password_hash = hashlib.sha1(password.encode()).hexdigest()

        if user_password is None:
            return jsonify({"error": "Usuario no encontrado"}), 404       
        # Check if the provided password matches the hashed password in the database
        if password_hash == user_password[0]:
            return jsonify({"usuario": user_password[1], "message": "Inicio de sesión exitoso"}), 200
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/crear_reserva", methods=["POST"])
def crear_reserva():
    # Extract data from POST request
    data = request.get_json()
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(url)
        

        # SQL query to insert data into the reserva table
        cur = conn.cursor()
        sql_query = """
        INSERT INTO reserva (numreserva, idvehiculo, idmetodopago, idusuario, idparqueadero, idtipodescuento, montototal, duracionestadia, fechareserva)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        # Values to insert
        values = (
            data['numreserva'], data['idvehiculo'], data['idmetodopago'],
            data['idusuario'], data['idparqueadero'], data['idtipodescuento'],
            data['montototal'], data['duracionestadia'], data['fechareserva']
        )

        # Execute the query
        cur.execute(sql_query, values)
        conn.commit()

        # Close the connection
        cur.close()
        conn.close()

        return jsonify({"message": "Reserva creada con éxito"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/agregar_vehiculo", methods=["POST"])
def agregar_vehiculo():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        data = request.get_json()

        # SQL query to insert data into the vehiculo table
        sql_query = """
        INSERT INTO vehiculo (idvehiculo, idmarca, idtipovehiculo, idusuario, placasvehiculo, color)
        VALUES (%s, %s, %s, %s, %s,%s)
        """
        values = (
            data['idvehiculo'], data['idmarca'], data['idtipovehiculo'], data['idusuario'],
            data['placasvehiculo'], data['color']
        )
        # Execute the query
        cur.execute(sql_query, values)
        conn.commit()
        
        cur.close()
        conn.close()
        return jsonify({"message": "Vehiculo añadido con éxito"}), 201

    except Exception as e:
        cur.close()
        conn.close()
        return jsonify({"error": str(e)}), 400

@app.route("/crear_parqueadero", methods=["POST"])
def crear_parqueadero():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        data = request.get_json()

        # SQL query to insert data into the vehiculo table
        sql_query = """
        INSERT INTO parqueadero (idparqueadero, idtipoparqueadero, nombreparqueadero, direccion, capacidadtotal, capacidadactual, numerocontacto)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            data['idparqueadero'], data['idtipoparqueadero'], data['nombreparqueadero'], data['direccion'],
            data['capacidadtotal'], data['capacidadactual'], data['numerocontacto']
        )
        # Execute the query
        cur.execute(sql_query, values)
        conn.commit()
        
        cur.close()
        conn.close()



        return jsonify({"message": "Parqueadero añadido con éxito"}), 201
    except Exception as e:
        cur.close()
        conn.close()
        return jsonify({"error": str(e)}), 400

@app.route("/api/get_usuario/<idusuario>", methods=["GET"])
def get_usuario(idusuario):
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        sql_query = "SELECT * FROM usuario WHERE idusuario = %s"
        cur.execute(sql_query, (idusuario,))
        user_info = cur.fetchone()
        if user_info:
            return jsonify(user_info), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/api/get_reserva/<numreserva>", methods=["GET"])
def get_reserva(numreserva):
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        sql_query = "SELECT * FROM reserva WHERE numreserva = %s"
        cur.execute(sql_query, (numreserva,))
        reserva_info = cur.fetchone()
        if reserva_info:
            return jsonify(reserva_info), 200
        else:
            return jsonify({"error": "Reserva no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/api/get_vehiculo/<idvehiculo>", methods=["GET"])
def get_vehiculo(idvehiculo):
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        sql_query = "SELECT * FROM vehiculo WHERE idvehiculo = %s"
        cur.execute(sql_query, (idvehiculo,))
        vehiculo_info = cur.fetchone()
        if vehiculo_info:
            return jsonify(vehiculo_info), 200
        else:
            return jsonify({"error": "Vehículo no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/api/get_parqueadero/<idparqueadero>", methods=["GET"])
def get_parqueadero(idparqueadero):
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        sql_query = "SELECT * FROM parqueadero WHERE idparqueadero = %s"
        cur.execute(sql_query, (idparqueadero,))
        parqueadero_info = cur.fetchone()
        if parqueadero_info:
            return jsonify(parqueadero_info), 200
        else:
            return jsonify({"error": "Parqueadero no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/api/get_parqueaderos/", methods=["GET"])
def get_parqueaderos():
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        sql_query = "SELECT * FROM parqueadero"
        cur.execute(sql_query)
        parqueadero_info = cur.fetchall()
        if parqueadero_info:
            return jsonify(parqueadero_info), 200
        else:
            return jsonify({"error": "Parqueadero no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=True)



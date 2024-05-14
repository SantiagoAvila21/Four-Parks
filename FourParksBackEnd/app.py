import os 
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from werkzeug.security import check_password_hash
from flask_cors import CORS
import hashlib
import string
import secrets
import random

load_dotenv()

# Create the Flask application
app = Flask(__name__)

# Configuracion del correo de la aplicacion
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Servidor SMTP de Gmail
app.config['MAIL_PORT'] = 587  # Puerto SMTP de Gmail
app.config['MAIL_USE_TLS'] = True  # Habilitar TLS (Transport Layer Security)
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

def generate_password():
    # Definir los caracteres permitidos para generar la contraseña
    characters = string.ascii_letters + string.digits
    
    # Generar la contraseña aleatoria
    while True:
        password = ''.join(secrets.choice(characters) for _ in range(secrets.randbelow(5) + 4))  # Entre 5 y 8 caracteres
        # Verificar si la contraseña cumple con los requisitos
        if (any(char.isdigit() for char in password) and  # Al menos un número
            any(char.isupper() for char in password) and  # Al menos una letra mayúscula
            any(char.islower() for char in password)):    # Al menos una letra minúscula
            break
    
    return password

# Generar código aleatorio de 6 dígitos
def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))


mail = Mail(app)
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
            tiposdocs = cursor.fetchall()
            if tiposdocs:
                result = []
                for tipodoc in tiposdocs:
                    result.append({"id": tipodoc[0], "tipodocs": tipodoc[1]})
                    cursor.close()
                return jsonify(result)
            else:
                cursor.close()
                return jsonify({"error": f"Users not found."}), 404

@app.route("/register", methods=["POST"])
def register():
    try:
        # Conexion con la BD
        connection = psycopg2.connect(url)
        data = request.get_json()
        cursor = connection.cursor()

        # Verificar si el correo electrónico ya está en uso
        cursor.execute("SELECT COUNT(*) FROM usuario WHERE correoelectronico = %s", (data['correoelectronico'],))
        existe_usuario = cursor.fetchone()[0]
        if existe_usuario > 0:
            return jsonify({"error": "El correo electrónico ya está en uso"}), 400

        # Obtener el número total de usuarios en la tabla usuario
        cursor.execute("SELECT COUNT(idusuario) FROM usuario")
        total_usuarios = cursor.fetchone()[0]

        # Calcular el nuevo idusuario
        nuevo_idusuario = 'P' + str(total_usuarios + 1)

        # Se genera la contraseña para el nuevo usuario
        nueva_contrasenia = generate_password()
        # Se le hace un hash a esa misma contraseña para subirla a la base de datos
        contraseniaHashed = hashlib.sha1(nueva_contrasenia.encode()).hexdigest()

        # Se realiza la query en cuestion
        sql_query ="""
            INSERT INTO usuario (idusuario, idtipousuario, idtipodocumento, nombreusuario, numdocumento, contrasenia, puntosacumulados, correoelectronico, estado, first_login)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
        values = (nuevo_idusuario, data['idtipousuario'], data['idtipodocumento'], data['nombreusuario'], 
                    data['numdocumento'], contraseniaHashed, data['puntosacumulados'], data['correoelectronico'], 'unlocked', True)
        cursor.execute(sql_query, values)
        connection.commit()

        # Cerrar la Conexion
        cursor.close()
        connection.close()

        # Se manda directamente el correo al nuevo usuario con su contraseña 
        msg = Message("Nueva Contraseña para Four Parks",
            sender=os.getenv("MAIL_USERNAME"),
            recipients=[data['correoelectronico']])
        msg.body = f'Tu nueva contraseña para el sistema Four Parks es: {nueva_contrasenia}'
        mail.send(msg)

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

        # Query para encontrar el usuario por correo electronico
        cur.execute("SELECT contrasenia FROM usuario WHERE correoelectronico = %s", (email,))
        user_password = cur.fetchone()    
        password_hash = hashlib.sha1(password.encode()).hexdigest()

        if user_password is None:
            return jsonify({"error": "Usuario no encontrado"}), 404       
        
        # Revisamos si la contraseña hasheada es la misma que esta en la Base de Datos
        if password_hash == user_password[0]:
            # Actualizar el campo first_login en la base de datos
            cur.execute("UPDATE usuario SET first_ login = %s WHERE correoelectronico = %s", (False, email))
            conn.commit()

            # Generacion del codigo de verificacion
            verification_code = generate_verification_code()

            # Subir el codigo de verificacion a la base de datos
            cur.execute('UPDATE usuario SET codigo = %s WHERE correoelectronico = %s', (verification_code, email))

            msg = Message('Código de verificación', 
                sender=os.getenv("MAIL_USERNAME"), 
                recipients=[email])
            msg.body = f'Su código de verificación es: {verification_code}'
            mail.send(msg)
            
            conn.commit() 
            return jsonify({"message": "Codigo de Verificacion enviado por Correo Electronico"}), 200
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/verify', methods=['POST'])
def verify():
    data = request.json
    email = data.get('correoelectronico')
    verification_code = data.get('codigo')
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(url)

        cur = conn.cursor()

        # Verificar si el usuario y el código coinciden
        cur.execute("SELECT codigo, nombreusuario FROM usuario WHERE correoelectronico = %s", (email,))
        stored_verification_code = cur.fetchone()

        if stored_verification_code and stored_verification_code[0] == verification_code:
            return {"usuario": stored_verification_code[1], 'message': 'Código de verificación correcto.'}, 200
        else:
            return {'error': 'Código de verificación incorrecto.'}, 400
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

@app.route("/api/get_parqueaderos/<idtipoparqueadero>", methods=["GET"])
def get_parqueaderos_tipo(idtipoparqueadero):
    connection = psycopg2.connect(url)
    with connection:
        with connection.cursor() as cursor:
            sql_query = "SELECT * FROM parqueadero WHERE idtipoparqueadero = %s"
            cursor.execute(sql_query, (idtipoparqueadero,))
            parqueaderos = cursor.fetchall()
            if parqueaderos:
                return jsonify(parqueaderos), 200
            else:
                cursor.close()
                return jsonify({"error": f"Parqueaderos no encontrados."}), 404

@app.route("/api/send_passw/<idusuario>", methods=["GET"])
def send_passw(idusuario):
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        sql_query = "SELECT correoelectronico  FROM usuario WHERE idusuario = %s"
        cur.execute(sql_query, (idusuario,))
        correoUser = cur.fetchone()
        print(correoUser[0]);
        if correoUser:
            msg = Message("Hello",
                    sender=os.getenv("MAIL_USERNAME"),
                    recipients=[correoUser[0]])
            msg.body = 'Este es un correo de prueba'
            mail.send(msg)
            return jsonify(correoUser), 200
        else:
            return jsonify({"Error": "Correo no disponible"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()



if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=True)
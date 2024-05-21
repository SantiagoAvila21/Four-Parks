import os 
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, jsonify, Response, render_template
from flask_mail import Mail, Message
from werkzeug.security import check_password_hash
from flask_cors import CORS, cross_origin
import hashlib
import string
import secrets
import random
from payments import *
from datetime import datetime

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

mail = Mail(app)
CORS(app)
# Load Database URL from .env
url = os.getenv("DATABASE_URL")
# Connect to the DB
connection = psycopg2.connect(url)

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

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res


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
        print(nueva_contrasenia)
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
        cur.execute("SELECT contrasenia, estado FROM usuario WHERE correoelectronico = %s", (email,))
        user_password = cur.fetchone()    
        password_hash = hashlib.sha1(password.encode()).hexdigest()

        if user_password is None:
            return jsonify({"error": "Usuario no encontrado"}), 404       
        
        if user_password[1] == 'locked':
            return jsonify({"error": "Usuario se encuentra bloqueado"}), 403

        # Revisamos si la contraseña hasheada es la misma que esta en la Base de Datos
        if password_hash == user_password[0]:
            # Generacion del codigo de verificacion
            verification_code = generate_verification_code()

            # Subir el codigo de verificacion a la base de datos
            cur.execute('UPDATE usuario SET codigo = %s WHERE correoelectronico = %s', (verification_code, email))
            conn.commit() 

            msg = Message('Código de verificación', 
                sender=os.getenv("MAIL_USERNAME"), 
                recipients=[email])
            msg.body = f'Su código de verificación es: {verification_code}'
            mail.send(msg)
            
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

        # Verificar si el usuario y el código coinciden, se devuelve al igual el rol del usuario para que se maneje sobre eso en el frontend
        cur.execute("SELECT codigo, nombreusuario, first_login, idtipousuario FROM usuario WHERE correoelectronico = %s", (email,))
        stored_verification_code = cur.fetchone()

        if stored_verification_code and stored_verification_code[0] == verification_code:
            # Actualizar el campo first_login en la base de datos
            first_log = stored_verification_code[2] 
            print(first_log, "----")
            if first_log:
                cur.execute("UPDATE usuario SET first_login = %s WHERE correoelectronico = %s", (False, email))
                conn.commit()

            tipo_usuario = ""
            if stored_verification_code[3] == 1:
                tipo_usuario = 'Administrador General'
            elif stored_verification_code[3] == 2:
                tipo_usuario = 'Administrador de Punto'
            else: 
                tipo_usuario = 'Cliente'

            return {"primerLog": first_log, "usuario": stored_verification_code[1], "tipoUsuario": tipo_usuario, 'message': 'Código de verificación correcto.'}, 200
        else:
            return {'error': 'Código de verificación incorrecto.'}, 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Ruta que bloque a un usuario en el caso que ingrese tres veces mal la contraseña
@app.route("/block_usuario", methods=["PUT"])
def block_usuario():
    data = request.get_json()
    email = data['correoelectronico']

    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()

        cur.execute("UPDATE usuario SET estado = 'locked' WHERE correoelectronico = %s", (email,))
        conn.commit()

        msg = Message('Bloqueo de usuario', 
            sender = os.getenv("MAIL_USERNAME"), 
            recipients=[os.getenv("MAIL_USERNAME")])
        msg.body = f'El usuario con correo: {email} ha sido bloqueado debido a 3 intentos fallidos de inicio de sesión.'
        mail.send(msg)

        return jsonify({"message": "Usuario bloqueado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Ruta que desbloquea a un usuario en el caso que el admnistrador general lo desee
@app.route("/unlock_usuario", methods=["PUT"])
def unlock_usuario():
    data = request.get_json()
    email = data['correoelectronico']

    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()

        cur.execute("UPDATE usuario SET estado = 'unlocked' WHERE correoelectronico = %s", (email,))
        conn.commit()

        msg = Message('Cuenta Desbloqueada', 
            sender = os.getenv("MAIL_USERNAME"), 
            recipients=[email])
        msg.body = f'Tu cuenta de Four Parks ha sido desbloqueada, por nuestro Administrador General'
        mail.send(msg)

        return jsonify({"message": "Usuario desbloqueado"}), 200
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
        email = data['correoelectronico']

        # SQL query to insert data into the reserva table
        cur = conn.cursor()

        # Obtener el número total de usuarios en la tabla usuario
        cur.execute("SELECT COUNT(numreserva) FROM RESERVA")
        total_reservas = cur.fetchone()[0]

        # Calcular el nuevo idtarjeta
        nuevo_idreserva = 'R' + str(total_reservas + 1)

        cur.execute("SELECT idusuario FROM usuario WHERE correoelectronico =  %s", (email, ));
        idusuario = cur.fetchone()[0];


        sql_query = """
            INSERT INTO reserva (numreserva, idusuario, idparqueadero, montototal, fechareservaentrada, fechareservasalida)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        # Values to insert
        values = (
            nuevo_idreserva, idusuario, data['idparqueadero'], data['montototal'], data['fechareservaentrada'], data['fechareservasalida']
        )

        # Execute the query
        cur.execute(sql_query, values)
        reserva = {
            "numreserva": nuevo_idreserva,
            "idusuario": idusuario,
            "idparqueadero": data['idparqueadero'],
            "montototal": data['montototal'],
            "fechareservaentrada": data['fechareservaentrada'],
            "fechareservasalida": data['fechareservasalida'],
        }
        conn.commit()

        # Close the connection
        cur.close()
        conn.close()

        return jsonify({"message": "Reserva creada con éxito", "reserva": reserva}), 201

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
    finally:
        cur.close()
        conn.close()

@app.route("/modificar_parqueadero", methods=["POST"])
def modificar_parqueadero():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        data = request.get_json()

        # SQL query to update data into the parqueadero table
        sql_query = "UPDATE parqueadero SET capacidadtotal = %s, capacidadactual = %s WHERE idparqueadero = %s"

        values = (
            data['capacidadtotal'], data['capacidadactual'],data['idparqueadero']
        )
        # Execute the query
        cur.execute(sql_query, values)
        conn.commit()
        
        cur.close()
        conn.close()

        return jsonify({"message": "Parqueadero modificado con éxito"}), 201
    except Exception as e:
        cur.close()
        conn.close()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@app.route("/crear_tarjeta", methods=["POST"])
def crear_tarjeta():
    # Extract data from POST request
    data = request.get_json()
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(url)
        email = data['correoelectronico']

        # SQL query to insert data into the TARJETA_CREDITO table
        cur = conn.cursor()

        # Obtener el número total de usuarios en la tabla usuario
        cur.execute("SELECT COUNT(idtarjeta) FROM tarjetacredito")
        total_tarjetas = cur.fetchone()[0]

        # Calcular el nuevo idtarjeta
        nuevo_idtarjeta = 'T' + str(total_tarjetas + 1)

        cur.execute("SELECT idusuario FROM usuario WHERE correoelectronico =  %s", (email, ));
        idusuario = cur.fetchone()[0];

        respuesta = registrar_tarjeta(data['numero_tarjeta'], data['fecha_expiracion'], data['codigoseguridad'])

        if(respuesta.get('error')):
            return respuesta, 403

        sql_query = """
        INSERT INTO TARJETACREDITO (IDTARJETA, IDUSUARIO, NUMTARJETA, FECHAVENCIMIENTO, CODIGOSEGURIDAD, NOMBREPROPIETARIO)
        VALUES(%s, %s, %s, %s, %s, %s)
        """
        # Values to insert
        values = (
            nuevo_idtarjeta, idusuario, data['numero_tarjeta'],
            data['fecha_expiracion'], data['codigoseguridad'], data['nombrepropietario']
        )

        # Execute the query
        cur.execute(sql_query, values)
        conn.commit()

        # Close the connection
        cur.close()
        conn.close()

        return jsonify({"message": "Tarjeta de credito creada con éxito"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/obtener_tarjeta/<correo>", methods=["GET"])
def obtener_tarjeta(correo):
    try:
        # Conectar a la base de datos PostgreSQL
        conn = psycopg2.connect(url)
        cur = conn.cursor()


        # Consulta SQL para obtener la información de la tarjeta de crédito de un usuario específico
        sql_query = "SELECT T.NOMBREPROPIETARIO, T.NUMTARJETA, T.FECHAVENCIMIENTO, T.CODIGOSEGURIDAD FROM TARJETACREDITO T, USUARIO U WHERE U.CORREOELECTRONICO = %s AND T.IDUSUARIO = U.IDUSUARIO"

        # Ejecutar la consulta
        cur.execute(sql_query, (correo,))
        tarjeta_info = cur.fetchone()

        # Verificar si se encontró la tarjeta
        if tarjeta_info:
            tarjeta_data = {
                "NOMBREPROPIETARIO": tarjeta_info[0],
                "NUMTARJETA": tarjeta_info[1],
                "FECHAVENCIMIENTO": tarjeta_info[2],
                "CODIGOSEGURIDAD": tarjeta_info[3]
            }
            return jsonify(tarjeta_data), 200
        else:
            return jsonify({"error": "Tarjeta no encontrada para el usuario dado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()

@app.route("/pago_tarjeta", methods=["POST"])
def pago_tarjeta():
    try:
        # Connect to the PostgreSQL database
        #conn = psycopg2.connect(url)
        #cur = conn.cursor()
        data = request.get_json()

        # SQL query to update data into the parqueadero table
        #sql_query = ""

        #values = (
        #    data['capacidadtotal'], data['capacidadactual'],data['idparqueadero']
        #)
        # Execute the query
        #cur.execute(sql_query, values)
        #conn.commit()
        ntarjeta = data['numtarjeta']
        
        respuesta = process_payment(data['nombre'], ntarjeta, data['f_expiracion'], data['security_code'], data['correoelectronico'])
        print(respuesta)

        return respuesta, 201
    except Exception as e:
        #cur.close()
        #conn.close()
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

@app.route("/api/get_usuarios/", methods=["GET"])
def get_usuarios():
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        sql_query = "SELECT nombreusuario, correoelectronico, idtipousuario, estado FROM usuario WHERE idtipousuario != 1 order by nombreusuario"
        cur.execute(sql_query)
        users_info = cur.fetchall()
        if users_info:
            return jsonify(users_info), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/api/cambiar_tipousuario", methods=["PUT"])
def cambiar_tipousuario():
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        data = request.get_json()
        correo = data['correoelectronico']
        tipo_usuario = data['tipousuario']
        idparqueadero = data['idparqueadero']

        # Si se quiere convertir un Usuario en Cliente, no debe tener ningun parqueadero a cargo
        if tipo_usuario == 3:
            idparqueadero = None

        sql_query = "UPDATE usuario SET idtipousuario = %s, idparkingmanejado = %s WHERE correoelectronico = %s"
        cur.execute(sql_query, (tipo_usuario, idparqueadero, correo,))
        conn.commit();

        # Solucionado el problema de CORS usando Access-Control-Allow-Origin
        return jsonify({"message": f"Rol cambiado correctamente"}), 200

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

@app.route("/api/cambiar_contrasenia", methods=["PUT"])
def cambiar_contrasenia():
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        data = request.get_json()
        correo = data['correoelectronico']
        contrasenia = data['contrasenia']

        # Hashear la nueva contraseña y ponerla en la base de datos
        new_password_hash = hashlib.sha1(contrasenia.encode()).hexdigest()


        sql_query = "UPDATE usuario SET contrasenia = %s WHERE correoelectronico = %s"
        cur.execute(sql_query, (new_password_hash,correo,))
        conn.commit();

        # Solucionado el problema de CORS usando Access-Control-Allow-Origin
        return jsonify({"success": f"Contraseña cambiada correctamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/factura', methods=["POST"])
def factura():
    now = datetime.now()
    fecha_generado = now.strftime("%Y-%m-%d %H:%M:%S")
    data = request.get_json()

    msg = Message("Factura Reserva",
        sender=os.getenv("MAIL_USERNAME"),
        recipients=[data['correoelectronico']])

    def generar_numero_factura():
        letras = ''.join(random.choices(string.ascii_uppercase, k=3))
        numeros = ''.join(random.choices(string.digits, k=7))
        return letras + numeros
    


    msg.html = render_template('template.html', num_Factura = generar_numero_factura(),
        nombre_cliente = data['nombre'],
        fecha_factura = fecha_generado,
        desc_factura = f"Reserva en {data['parqueadero']}",
        precio_hora = f"${data['tarifa']},0",
        cantidad = f"{data['cantidadhoras']} horas",
        total = f"${data['montototal']},0",
        subtotal = f"${data['montototal']},0",
        fechagenerado = fecha_generado)
    mail.send(msg)


    return jsonify({"message": "Factura mandada correctamente"}), 200

if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=True)

import os
from flask import Blueprint, request, jsonify
from app.utils.email_utils import send_email
from flask_mail import Mail, Message
from app import mail
from app.utils.db_utils import get_db_connection
from app.utils.password_utils import generate_password, generate_verification_code
import hashlib

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        connection = get_db_connection()
        data = request.get_json()
        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) FROM usuario WHERE correoelectronico = %s", (data['correoelectronico'],))
        existe_usuario = cursor.fetchone()[0]
        if existe_usuario > 0:
            return jsonify({"error": "El correo electrónico ya está en uso"}), 400

        # Obtener el último idusuario utilizado
        cursor.execute("SELECT MAX(idusuario) FROM usuario")
        ultimo_id = cursor.fetchone()[0]

        if ultimo_id:
            # Incrementar el último idusuario en uno
            numero = int(ultimo_id[1:]) + 1
            nuevo_idusuario = 'P' + str(numero).zfill(3)
        else:
            # En caso de que no haya usuarios registrados aún
            nuevo_idusuario = 'P001'

        nueva_contrasenia = generate_password()
        contraseniaHashed = hashlib.sha1(nueva_contrasenia.encode()).hexdigest()

        sql_query = """
            INSERT INTO usuario (idusuario, idtipousuario, idtipodocumento, nombreusuario, numdocumento, contrasenia, puntosacumulados, correoelectronico, estado, first_login)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (nuevo_idusuario, data['idtipousuario'], data['idtipodocumento'], data['nombreusuario'],
                  data['numdocumento'], contraseniaHashed, data['puntosacumulados'], data['correoelectronico'], 'unlocked', True)
        cursor.execute(sql_query, values)
        connection.commit()

        send_email(data['correoelectronico'], "Nueva Contraseña para Four Parks", f'Tu nueva contraseña para el sistema Four Parks es: {nueva_contrasenia}')

        return jsonify({"message": "Usuario insertado con éxito"}), 201  
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        connection.close()


# Add similar routes for login, verify, block_usuario, unlock_usuario, etc.
@auth_bp.route("/login", methods=["POST"])
def login():
    # Extract email and password from POST request
    data = request.get_json()
    email = data.get('correoelectronico')
    password = data.get('contrasenia')
    if not email or not password:
        return jsonify({"error": "Email y contraseña requeridos"}), 400
    
    try:
        # Connect to the PostgreSQL database
        conn = get_db_connection()

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

@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.json
    email = data.get('correoelectronico')
    verification_code = data.get('codigo')
    try:
        # Connect to the PostgreSQL database
        conn = get_db_connection()

        cur = conn.cursor()

        # Verificar si el usuario y el código coinciden, se devuelve al igual el rol del usuario para que se maneje sobre eso en el frontend
        cur.execute("SELECT codigo, nombreusuario, first_login, idtipousuario, puntosacumulados FROM usuario WHERE correoelectronico = %s", (email,))
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

            return {"primerLog": first_log, "usuario": stored_verification_code[1], "tipoUsuario": tipo_usuario, "puntos": stored_verification_code[4], 'message': 'Código de verificación correcto.'}, 200
        else:
            return {'error': 'Código de verificación incorrecto.'}, 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Ruta que bloque a un usuario en el caso que ingrese tres veces mal la contraseña
@auth_bp.route("/block_usuario", methods=["PUT"])
def block_usuario():
    data = request.get_json()
    email = data['correoelectronico']

    try:
        conn = get_db_connection()
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
@auth_bp.route("/unlock_usuario", methods=["PUT"])
def unlock_usuario():
    data = request.get_json()
    email = data['correoelectronico']

    try:
        conn = get_db_connection()
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
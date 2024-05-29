
import os
from flask import Blueprint, request, jsonify
from app.utils.email_utils import send_email
from flask_mail import Mail, Message
from app import mail
#from app.utils.db_utils import get_db_connection
from app.utils.password_utils import generate_password, generate_verification_code
from app.utils.db_utils import *
import hashlib
import uuid

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        print(data['correoelectronico'])


        # Verificar si el correo electrónico ya está en uso
        existe_usuario_query = "SELECT COUNT(*) FROM usuario WHERE correoelectronico = %s"
        existe_usuario = DatabaseFacade.execute_query(existe_usuario_query, (data['correoelectronico'],))[0][0]
        if existe_usuario > 0:
            return jsonify({"error": "El correo electrónico ya está en uso"}), 400

        # Obtener el último idusuario utilizado
        ultimo_id_query = "SELECT COUNT(idusuario) FROM usuario"
        ultimo_id_result = DatabaseFacade.execute_query(ultimo_id_query)
        ultimo_id = ultimo_id_result[0][0]

        if ultimo_id:
            # Incrementar el último idusuario en uno
            nuevo_idusuario = 'P0' + str(ultimo_id + 1)
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
        DatabaseFacade.execute_query(sql_query, values)

        # Se manda directamente el correo al nuevo usuario con su contraseña 
        msg = Message("Nueva Contraseña para Four Parks",
            sender=os.getenv("MAIL_USERNAME"),
            recipients=[data['correoelectronico']])
        msg.body = f'Tu nueva contraseña para el sistema Four Parks es: {nueva_contrasenia}'
        mail.send(msg)

        return jsonify({"message": "Usuario insertado con éxito"}), 201  
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Add similar routes for login, verify, block_usuario, unlock_usuario, etc.
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get('correoelectronico')
    password = data.get('contrasenia')
    if not email or not password:
        return jsonify({"error": "Email y contraseña requeridos"}), 400
    
    try:
        # Query para encontrar el usuario por correo electronico
        user_query = "SELECT contrasenia, estado FROM usuario WHERE correoelectronico = %s"
        user_password = DatabaseFacade.execute_query(user_query, (email,))
        if not user_password:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        user_password = user_password[0]
        password_hash = hashlib.sha1(password.encode()).hexdigest()

        if user_password[1] == 'locked':
            return jsonify({"error": "Usuario se encuentra bloqueado"}), 403

        # Revisamos si la contraseña hasheada es la misma que esta en la Base de Datos
        if password_hash == user_password[0]:
            # Generacion del codigo de verificacion
            verification_code = generate_verification_code()

            # Subir el codigo de verificacion a la base de datos
            update_code_query = 'UPDATE usuario SET codigo = %s WHERE correoelectronico = %s'
            DatabaseFacade.execute_query(update_code_query, (verification_code, email))

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


@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.json
    email = data.get('correoelectronico')
    verification_code = data.get('codigo')
    try:
        # Verificar si el usuario y el código coinciden
        verify_query = "SELECT codigo, nombreusuario, first_login, idtipousuario, puntosacumulados FROM usuario WHERE correoelectronico = %s"
        stored_verification_code = DatabaseFacade.execute_query(verify_query, (email,))

        if stored_verification_code and stored_verification_code[0][0] == verification_code:
            first_log = stored_verification_code[0][2]
            if first_log:
                update_first_login_query = "UPDATE usuario SET first_login = %s WHERE correoelectronico = %s"
                DatabaseFacade.execute_query(update_first_login_query, (False, email))

            tipo_usuario = ""
            if stored_verification_code[0][3] == 1:
                tipo_usuario = 'Administrador General'
            elif stored_verification_code[0][3] == 2:
                tipo_usuario = 'Administrador de Punto'
            else: 
                tipo_usuario = 'Cliente'

            return {
                "primerLog": first_log,
                "usuario": stored_verification_code[0][1],
                "tipoUsuario": tipo_usuario,
                "puntos": stored_verification_code[0][4],
                'message': 'Código de verificación correcto.'
            }, 200
        else:
            return {'error': 'Código de verificación incorrecto.'}, 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Ruta que bloque a un usuario en el caso que ingrese tres veces mal la contraseña
@auth_bp.route("/block_usuario", methods=["PUT"])
def block_usuario():
    data = request.get_json()
    email = data['correoelectronico']

    try:
        update_estado_query = "UPDATE usuario SET estado = 'locked' WHERE correoelectronico = %s"
        DatabaseFacade.execute_query(update_estado_query, (email,))

        msg = Message('Bloqueo de usuario', 
            sender=os.getenv("MAIL_USERNAME"), 
            recipients=[os.getenv("MAIL_USERNAME")])
        msg.body = f'El usuario con correo: {email} ha sido bloqueado debido a 3 intentos fallidos de inicio de sesión.'
        mail.send(msg)

        return jsonify({"message": "Usuario bloqueado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Ruta que desbloquea a un usuario en el caso que el admnistrador general lo desee
@auth_bp.route("/unlock_usuario", methods=["PUT"])
def unlock_usuario():
    data = request.get_json()
    email = data['correoelectronico']

    try:
        update_estado_query = "UPDATE usuario SET estado = 'unlocked' WHERE correoelectronico = %s"
        DatabaseFacade.execute_query(update_estado_query, (email,))

        msg = Message('Cuenta Desbloqueada', 
            sender=os.getenv("MAIL_USERNAME"), 
            recipients=[email])
        msg.body = f'Tu cuenta de Four Parks ha sido desbloqueada, por nuestro Administrador General'
        mail.send(msg)

        return jsonify({"message": "Usuario desbloqueado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


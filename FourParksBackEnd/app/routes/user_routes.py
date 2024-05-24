import os
from flask import Blueprint, request, jsonify, render_template
#from app.utils.db_utils import get_db_connection
from app.utils.payment_utils  import registrar_tarjeta
from flask_mail import Mail, Message
from app import mail
from app.utils.db_utils import *

user_bp = Blueprint('user', __name__, url_prefix='/user')

@user_bp.route("/tipodoc", methods=["GET"])
def get_all_tipodoc():
    SELECT_ALL_TIPODOC = "SELECT * FROM tipo_documento;"
    try:
        tiposdocs = DatabaseFacade.execute_query(SELECT_ALL_TIPODOC)
        if tiposdocs:
            result = [{"id": tipodoc[0], "tipodocs": tipodoc[1]} for tipodoc in tiposdocs]
            return jsonify(result)
        else:
            return jsonify({"error": "Users not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route("/crear_tarjeta", methods=["POST"])
def crear_tarjeta():
    data = request.get_json()
    try:
        email = data['correoelectronico']

        # Obtener el máximo idtarjeta actual
        max_idtarjeta_query = "SELECT MAX(CAST(SUBSTRING(idtarjeta, 2) AS INTEGER)) FROM tarjetacredito"
        max_idtarjeta = DatabaseFacade.execute_query(max_idtarjeta_query)
        max_idtarjeta = max_idtarjeta[0][0] if max_idtarjeta[0][0] else 0

        # Calcular el nuevo idtarjeta
        nuevo_idtarjeta = 'T' + str(max_idtarjeta + 1).zfill(3)

        idusuario_query = "SELECT idusuario FROM usuario WHERE correoelectronico = %s"
        idusuario_result = DatabaseFacade.execute_query(idusuario_query, (email,))
        idusuario = idusuario_result[0][0]

        respuesta = registrar_tarjeta(data['numero_tarjeta'], data['fecha_expiracion'], data['codigoseguridad'])

        if respuesta.get('error'):
            return respuesta, 403

        sql_query = """
        INSERT INTO tarjetacredito (idtarjeta, idusuario, numtarjeta, fechavencimiento, codigoseguridad, nombrepropietario)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            nuevo_idtarjeta, idusuario, data['numero_tarjeta'],
            data['fecha_expiracion'], data['codigoseguridad'], data['nombrepropietario']
        )
        DatabaseFacade.execute_query(sql_query, values)

        return jsonify({"message": "Tarjeta de credito creada con éxito"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@user_bp.route("/obtener_tarjeta/<correo>", methods=["GET"])
def obtener_tarjeta(correo):
    try:
        sql_query = """
        SELECT T.NOMBREPROPIETARIO, T.NUMTARJETA, T.FECHAVENCIMIENTO, T.CODIGOSEGURIDAD
        FROM TARJETACREDITO T
        JOIN USUARIO U ON T.IDUSUARIO = U.IDUSUARIO
        WHERE U.CORREOELECTRONICO = %s
        """
        tarjeta_info = DatabaseFacade.execute_query(sql_query, (correo,))

        if tarjeta_info:
            tarjeta_data = {
                "NOMBREPROPIETARIO": tarjeta_info[0][0],
                "NUMTARJETA": tarjeta_info[0][1],
                "FECHAVENCIMIENTO": tarjeta_info[0][2],
                "CODIGOSEGURIDAD": tarjeta_info[0][3]
            }
            return jsonify(tarjeta_data), 200
        else:
            return jsonify({"error": "Tarjeta no encontrada para el usuario dado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route("/get_usuario/<idusuario>", methods=["GET"])
def get_usuario(idusuario):
    sql_query = "SELECT * FROM usuario WHERE idusuario = %s"
    try:
        user_info = DatabaseFacade.execute_query(sql_query, (idusuario,))
        if user_info:
            return jsonify(user_info[0]), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route("/get_usuarios/", methods=["GET"])
def get_usuarios():
    sql_query = """
    SELECT nombreusuario, correoelectronico, idtipousuario, estado
    FROM usuario
    WHERE idtipousuario != 1
    ORDER BY nombreusuario
    """
    try:
        users_info = DatabaseFacade.execute_query(sql_query)
        if users_info:
            return jsonify(users_info), 200
        else:
            return jsonify({"error": "Usuarios no encontrados"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route("/cambiar_tipousuario", methods=["PUT"])
def cambiar_tipousuario():
    try:
        data = request.get_json()
        correo = data['correoelectronico']
        tipo_usuario = data['tipousuario']
        idparqueadero = data['idparqueadero']

        # Si se quiere convertir un Usuario en Cliente, no debe tener ningun parqueadero a cargo
        if tipo_usuario == 3:
            idparqueadero = None

        sql_query = "UPDATE usuario SET idtipousuario = %s, idparkingmanejado = %s WHERE correoelectronico = %s"
        DatabaseFacade.execute_query(sql_query, (tipo_usuario, idparqueadero, correo))

        return jsonify({"message": "Rol cambiado correctamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route("/cambiar_contrasenia", methods=["PUT"])
def cambiar_contrasenia():
    try:
        data = request.get_json()
        correo = data['correoelectronico']
        contrasenia = data['contrasenia']

        # Hashear la nueva contraseña y ponerla en la base de datos
        new_password_hash = hashlib.sha1(contrasenia.encode()).hexdigest()

        sql_query = "UPDATE usuario SET contrasenia = %s WHERE correoelectronico = %s"
        DatabaseFacade.execute_query(sql_query, (new_password_hash, correo))

        return jsonify({"success": "Contraseña cambiada correctamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@user_bp.route("/reclamar_puntos", methods=["PUT"])
def reclamar_puntos():
    try:
        data = request.get_json()
        correo = data['correoelectronico']
        puntos = data['puntosreclamados']

        # Actualizar los puntos acumulados del usuario
        sql_update_puntos = "UPDATE usuario SET puntosacumulados = puntosacumulados - %s WHERE correoelectronico = %s"
        DatabaseFacade.execute_query(sql_update_puntos, (puntos, correo))

        # Obtener los puntos actualizados del usuario
        sql_select_puntos = "SELECT puntosacumulados FROM usuario WHERE correoelectronico = %s"
        puntos_result = DatabaseFacade.execute_query(sql_select_puntos, (correo,))
        puntos_acumulados = puntos_result[0][0]

        return jsonify({"puntos": puntos_acumulados, "success": "Puntos reclamados satisfactoriamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

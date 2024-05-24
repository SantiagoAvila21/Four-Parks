import os
from flask import Blueprint, request, jsonify, render_template
from app.utils.db_utils import get_db_connection
from app.utils.payment_utils  import registrar_tarjeta
from flask_mail import Mail, Message
from app import mail

user_bp = Blueprint('user', __name__, url_prefix='/user')

@user_bp.route("/crear_tarjeta", methods=["POST"])
def crear_tarjeta():
    # Extract data from POST request
    data = request.get_json()
    try:
        # Connect to the PostgreSQL database
        conn = get_db_connection()
        email = data['correoelectronico']

        # SQL query to insert data into the TARJETA_CREDITO table
        cur = conn.cursor()

        # Obtener el máximo idtarjeta actual
        cur.execute("SELECT MAX(CAST(SUBSTRING(idtarjeta, 2) AS INTEGER)) FROM tarjetacredito")
        max_idtarjeta = cur.fetchone()[0]
        if max_idtarjeta is None:
            max_idtarjeta = 0

        # Calcular el nuevo idtarjeta
        nuevo_idtarjeta = 'T' + str(max_idtarjeta + 1).zfill(3)

        cur.execute("SELECT idusuario FROM usuario WHERE correoelectronico = %s", (email,))
        idusuario = cur.fetchone()[0]

        respuesta = registrar_tarjeta(data['numero_tarjeta'], data['fecha_expiracion'], data['codigoseguridad'])

        if respuesta.get('error'):
            return respuesta, 403

        sql_query = """
        INSERT INTO tarjetacredito (idtarjeta, idusuario, numtarjeta, fechavencimiento, codigoseguridad, nombrepropietario)
        VALUES (%s, %s, %s, %s, %s, %s)
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


@user_bp.route("/obtener_tarjeta/<correo>", methods=["GET"])
def obtener_tarjeta(correo):
    try:
        # Conectar a la base de datos PostgreSQL
        conn = get_db_connection()
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

@user_bp.route("/tipodoc", methods=["GET"])
def get_all_tipodoc():
    connection = get_db_connection()
    SELECT_ALL_TIPODOC = "SELECT * FROM tipo_documento;"
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

@user_bp.route("/get_usuario/<idusuario>", methods=["GET"])
def get_usuario(idusuario):
    try:
        conn = get_db_connection()
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

@user_bp.route("/get_usuarios/", methods=["GET"])
def get_usuarios():
    try:
        conn = get_db_connection()
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

@user_bp.route("/cambiar_tipousuario", methods=["PUT"])
def cambiar_tipousuario():
    try:
        conn = get_db_connection()
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

@user_bp.route("/cambiar_contrasenia", methods=["PUT"])
def cambiar_contrasenia():
    try:
        conn = get_db_connection()
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
        con.close()

@user_bp.route("/reclamar_puntos", methods=["PUT"])
def reclamar_puntos():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        data = request.get_json()
        correo = data['correoelectronico']
        puntos = data['puntosreclamados']

        sql_query = "UPDATE usuario SET puntosacumulados = puntosacumulados - %s WHERE correoelectronico = %s"
        cur.execute(sql_query, (puntos, correo))
        conn.commit()

        cur.execute("SELECT puntosacumulados FROM usuario WHERE correoelectronico = %s", (correo, ))
        puntos = cur.fetchone()

        return jsonify({"puntos": puntos[0], "success": "Puntos reclamados satisfactoriamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
# app/routes/parqueadero_routes.py
from flask import Blueprint, request, jsonify
from app.utils.db_utils import get_db_connection

parqueadero_bp = Blueprint('parqueadero', __name__, url_prefix='/parqueadero')

@parqueadero_bp.route("/crear_parqueadero", methods=["POST"])
def crear_parqueadero():
    try:
        # Connect to the PostgreSQL database
        conn = get_db_connection()
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

@parqueadero_bp.route("/modificar_parqueadero", methods=["POST"])
def modificar_parqueadero():
    try:
        # Connect to the PostgreSQL database
        conn = get_db_connection()
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

@parqueadero_bp.route("/get_parqueadero/<idparqueadero>", methods=["GET"])
def get_parqueadero(idparqueadero):
    try:
        conn = get_db_connection()
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

@parqueadero_bp.route("/get_parqueaderos/", methods=["GET"])
def get_parqueaderos():
    try:
        conn = get_db_connection()
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

@parqueadero_bp.route("/get_parqueaderos/<idtipoparqueadero>", methods=["GET"])
def get_parqueaderos_tipo(idtipoparqueadero):
    connection = get_db_connection()
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

@parqueadero_bp.route("/get_parqueadero_administrador/<correoelectronico>", methods=["GET"])
def get_parqueadero_administrador(correoelectronico):
    connection = get_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql_query = "SELECT idparqueadero, nombreparqueadero, tarifacarro, tarifamoto, tarifabici, tarifamulta FROM parqueadero P, usuario U WHERE U.idparkingmanejado = P.idparqueadero and U.correoelectronico = %s"
            cursor.execute(sql_query, (correoelectronico,))
            info_parqueadero = cursor.fetchall()[0]

            data = {
                "idparqueadero": info_parqueadero[0],
                "nombreparqueadero": info_parqueadero[1],
                "tarifacarro": info_parqueadero[2],
                "tarifamoto": info_parqueadero[3],
                "tarifabici": info_parqueadero[4],
                "tarifamulta": info_parqueadero[5]
            }
            if info_parqueadero:
                return data, 200
            else:
                cursor.close()
                return jsonify({"error": f"Parqueaderos no encontrados."}), 404

@parqueadero_bp.route("/cambiar_tarifa_parqueadero", methods=["PUT"])
def cambiar_tarifa_parqueadero():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        data = request.get_json()

        # Obtener los datos proporcionados en la solicitud
        tarifa = data['tarifa']
        valor = data['valor']
        idparqueadero = data['idparqueadero']

        # Validar que la columna proporcionada sea una de las opciones permitidas
        tarifas_permitidas = {"tarifacarro", "tarifamoto", "tarifabici", "tarifamulta"}
        if tarifa not in tarifas_permitidas:
            return jsonify({"error": "Columna proporcionada no válida"}), 400

        # SQL query para actualizar la columna especificada en la tabla parqueadero
        sql_query = f"UPDATE parqueadero SET {tarifa} = %s WHERE idparqueadero = %s"
        cur.execute(sql_query, (valor, idparqueadero,))
        conn.commit()

        # Cerrar la conexión con la base de datos
        cur.close()
        conn.close()

        return jsonify({"message": "Parqueadero modificado con éxito"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
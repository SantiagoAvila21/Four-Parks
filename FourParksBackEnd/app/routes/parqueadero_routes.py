# app/routes/parqueadero_routes.py
from flask import Blueprint, request, jsonify
#from app.utils.db_utils import get_db_connection
from app.utils.db_utils import *

parqueadero_bp = Blueprint('parqueadero', __name__, url_prefix='/parqueadero')

@parqueadero_bp.route("/crear_parqueadero", methods=["POST"])
def crear_parqueadero():
    try:
        data = request.get_json()

        sql_query = """
        INSERT INTO parqueadero (idparqueadero, idtipoparqueadero, nombreparqueadero, direccion, capacidadtotal, capacidadactual, numerocontacto)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['idparqueadero'], data['idtipoparqueadero'], data['nombreparqueadero'], data['direccion'],
            data['capacidadtotal'], data['capacidadactual'], data['numerocontacto']
        )
        DatabaseFacade.execute_query(sql_query, values)
        
        return jsonify({"message": "Parqueadero añadido con éxito"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@parqueadero_bp.route("/modificar_parqueadero", methods=["POST"])
def modificar_parqueadero():
    try:
        data = request.get_json()

        sql_query = "UPDATE parqueadero SET capacidadtotal = %s, capacidadactual = %s WHERE idparqueadero = %s"
        values = (data['capacidadtotal'], data['capacidadactual'], data['idparqueadero'])
        DatabaseFacade.execute_query(sql_query, values)

        return jsonify({"message": "Parqueadero modificado con éxito"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400



@parqueadero_bp.route("/get_parqueadero/<idparqueadero>", methods=["GET"])
def get_parqueadero(idparqueadero):
    try:
        sql_query = "SELECT * FROM parqueadero WHERE idparqueadero = %s"
        parqueadero_info = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        if parqueadero_info:
            return jsonify(parqueadero_info[0]), 200
        else:
            return jsonify({"error": "Parqueadero no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@parqueadero_bp.route("/get_parqueaderos/", methods=["GET"])
def get_parqueaderos():
    try:
        sql_query = "SELECT * FROM parqueadero"
        parqueadero_info = DatabaseFacade.execute_query(sql_query)
        if parqueadero_info:
            return jsonify(parqueadero_info), 200
        else:
            return jsonify({"error": "Parqueaderos no encontrados"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@parqueadero_bp.route("/get_parqueaderos/<idtipoparqueadero>", methods=["GET"])
def get_parqueaderos_tipo(idtipoparqueadero):
    try:
        sql_query = "SELECT * FROM parqueadero WHERE idtipoparqueadero = %s"
        parqueaderos = DatabaseFacade.execute_query(sql_query, (idtipoparqueadero,))
        if parqueaderos:
            return jsonify(parqueaderos), 200
        else:
            return jsonify({"error": "Parqueaderos no encontrados"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@parqueadero_bp.route("/get_parqueadero_administrador/<correoelectronico>", methods=["GET"])
def get_parqueadero_administrador(correoelectronico):
    try:
        sql_query = """
            SELECT P.idparqueadero, P.nombreparqueadero, P.tarifacarro, P.tarifamoto, P.tarifabici, P.tarifamulta
            FROM parqueadero P, usuario U
            WHERE U.idparkingmanejado = P.idparqueadero AND U.correoelectronico = %s
        """
        info_parqueadero = DatabaseFacade.execute_query(sql_query, (correoelectronico,))[0]
        print(info_parqueadero)

        if info_parqueadero:
            data = {
                "idparqueadero": info_parqueadero[0],
                "nombreparqueadero": info_parqueadero[1],
                "tarifacarro": info_parqueadero[2],
                "tarifamoto": info_parqueadero[3],
                "tarifabici": info_parqueadero[4],
                "tarifamulta": info_parqueadero[5]
             }
            return jsonify(data), 200
        else:
            return jsonify({"error": "Parqueadero no encontrado."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@parqueadero_bp.route("/cambiar_tarifa_parqueadero", methods=["PUT"])
def cambiar_tarifa_parqueadero():
    try:
        data = request.get_json()

        tarifa = data['tarifa']
        valor = data['valor']
        idparqueadero = data['idparqueadero']

        tarifas_permitidas = {"tarifacarro", "tarifamoto", "tarifabici", "tarifamulta"}
        if tarifa not in tarifas_permitidas:
            return jsonify({"error": "Columna proporcionada no válida"}), 400

        sql_query = f"UPDATE parqueadero SET {tarifa} = %s WHERE idparqueadero = %s"
        DatabaseFacade.execute_query(sql_query, (valor, idparqueadero))

        return jsonify({"message": "Parqueadero modificado con éxito"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



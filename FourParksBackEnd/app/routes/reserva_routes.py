import os
from flask import Blueprint, request, jsonify, render_template
#from app.utils.db_utils import get_db_connection
from datetime import datetime, timedelta
from app.utils.payment_utils import process_payment
import math
from flask_mail import Mail, Message
from app import mail
from app.utils.db_utils import *


reserva_bp = Blueprint('reserva', __name__, url_prefix='/reserva')

@reserva_bp.route("/crear_reserva", methods=["POST"])
def crear_reserva():
    data = request.get_json()
    try:
        now = datetime.now()

        email = data['correoelectronico']
        
        # Obtener el máximo numreserva actual
        max_numreserva_query = "SELECT MAX(CAST(SUBSTRING(numreserva, 2) AS INTEGER)) FROM reserva"
        max_numreserva = DatabaseFacade.execute_query(max_numreserva_query)
        max_numreserva = max_numreserva[0][0] if max_numreserva[0][0] else 0

        nuevo_idreserva = 'R' + str(max_numreserva + 1).zfill(3)

        idusuario_query = "SELECT idusuario FROM usuario WHERE correoelectronico = %s"
        idusuario_result = DatabaseFacade.execute_query(idusuario_query, (email,))
        if not idusuario_result:
            raise Exception("Usuario no encontrado")
        idusuario = idusuario_result[0][0]

        sql_query = """
            INSERT INTO reserva (numreserva, idusuario, idparqueadero, montototal, fechareservaentrada, fechareservasalida, fecharegistrada)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (nuevo_idreserva, idusuario, data['idparqueadero'], data['montototal'], data['fechareservaentrada'], data['fechareservasalida'], now)
        DatabaseFacade.execute_query(sql_query, values)
        DatabaseFacade.execute_query("UPDATE parqueadero SET capacidadactual = capacidadactual - 1 WHERE idparqueadero = %s", (data['idparqueadero'],))
        puntosUsuario = int(math.floor(data['montototal'] / 4000))
        DatabaseFacade.execute_query("UPDATE usuario SET puntosacumulados = puntosacumulados + %s WHERE correoelectronico = %s", (puntosUsuario, email))

        reserva = {"numreserva": nuevo_idreserva, "idusuario": idusuario, "idparqueadero": data['idparqueadero'],
                   "montototal": data['montototal'], "fechareservaentrada": data['fechareservaentrada'],
                   "fechareservasalida": data['fechareservasalida'], "puntos": puntosUsuario}
                   
        return jsonify({"message": "Reserva creada con éxito", "reserva": reserva}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@reserva_bp.route("/pago_tarjeta", methods=["POST"])
def pago_tarjeta():
    try:
        data = request.get_json()
        correo = data['correoelectronico']

        # Obtener los puntos acumulados del usuario
        puntos_query = "SELECT puntosacumulados FROM usuario WHERE correoelectronico = %s"
        puntos_result = DatabaseFacade.execute_query(puntos_query, (correo,))
        puntos = puntos_result[0][0] if puntos_result else 0

        # Procesar el pago
        respuesta = process_payment(data['nombre'], data['numtarjeta'], data['f_expiracion'], data['security_code'], correo)
        if respuesta.get('error'):
            return jsonify({"error": respuesta.get('error')}), 400

        return jsonify({"puntos": puntos}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@reserva_bp.route("/get_reserva/<numreserva>", methods=["GET"])
def get_reserva(numreserva):
    try:
        sql_query = "SELECT * FROM reserva WHERE numreserva = %s"
        reserva_info = DatabaseFacade.execute_query(sql_query, (numreserva,))
        if reserva_info:
            return jsonify(reserva_info[0]), 200
        else:
            return jsonify({"error": "Reserva no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route("/buscar_reservas", methods=["GET"])
def buscar_reservas():
    correo_electronico = request.args.get('correo_electronico')
    
    if not correo_electronico:
        return jsonify({"error": "El correo electrónico es requerido"}), 400
    
    try:
        sql_usuario_query = "SELECT idusuario FROM usuario WHERE correoelectronico = %s"
        usuario_result = DatabaseFacade.execute_query(sql_usuario_query, (correo_electronico,))
        if not usuario_result:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        idusuario = usuario_result[0][0]

        sql_reserva_query = """
        SELECT P.nombreparqueadero, R.fechareservaentrada, R.montototal, R.fechareservasalida, R.numreserva
        FROM reserva R, parqueadero P
        WHERE R.idusuario = %s AND P.idparqueadero = R.idparqueadero
        ORDER BY R.fechareservaentrada DESC
        """
        reservas = DatabaseFacade.execute_query(sql_reserva_query, (idusuario,))

        reservas_data = []
        now = datetime.now()
        for reserva in reservas:
            fechareserva = reserva[1]
            fechafin = reserva[3]
            
            if now < fechareserva:
                estado = "Cancelar"
            elif fechareserva <= now <= fechafin:
                estado = "En Progreso..."
            else:
                estado = "Finalizada"

            reservas_data.append({
                "nombreparqueadero": reserva[0],
                "fechareserva": reserva[1],
                "costo": reserva[2],
                "puntos": int(math.floor(reserva[2] / 4000)),
                "numreserva": reserva[4],
                "estado": estado
            })

        return jsonify(reservas_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route('/factura', methods=["POST"])
def factura():
    now = datetime.now()
    fecha_generado = now.strftime("%Y-%m-%d %H:%M:%S")
    data = request.get_json()

    msg = Message("Factura Reserva",
        sender=os.getenv("MAIL_USERNAME"),
        recipients=[data['correoelectronico']])

    msg.html = render_template('template.html', num_Factura=data['numfactura'],
        nombre_cliente=data['nombre_cliente'],
        fecha_factura=fecha_generado,
        desc_factura=f"Reserva en {data['parqueadero']}",
        precio_hora=f"${data['tarifa']},0",
        cantidad=f"{data['cantidadhoras']} horas",
        total=f"${data['montototal']},0",
        subtotal=f"${data['montototal']},0",
        fechagenerado=fecha_generado)
    mail.send(msg)
    return jsonify({"message": "Factura enviada correctamente"}), 200

@reserva_bp.route('/cancelar_reserva', methods=["DELETE"])
def cancelar_reserva():
    now = datetime.now() + timedelta(minutes=30)
    data = request.get_json()

    try:
        sql_reserva_info = "SELECT fechareservaentrada, idusuario FROM reserva WHERE numreserva = %s"
        reserva_info = DatabaseFacade.execute_query(sql_reserva_info, (data['numreserva'],))
        if not reserva_info:
            return jsonify({"error": "Reserva no encontrada"}), 404
        
        fechareservaentrada = reserva_info[0][0]
        idusuario = reserva_info[0][1]

        sql_tarifamulta = "SELECT tarifamulta FROM parqueadero WHERE nombreparqueadero = %s"
        tarifamulta_result = DatabaseFacade.execute_query(sql_tarifamulta, (data['parqueadero'],))
        tarifamulta = tarifamulta_result[0][0]

        # Verificar si la fecha actual es anterior en 30 minutos a la fecha de reserva entrada
        if now > fechareservaentrada - timedelta(minutes=30):
            fecha_generado = now.strftime("%Y-%m-%d %H:%M:%S")
            msg = Message("Factura Multa",
            sender=os.getenv("MAIL_USERNAME"),
            recipients=[data['correoelectronico']])

            msg.html = render_template('template.html', num_Factura=data['numfactura'],
                nombre_cliente=data['nombre_cliente'],
                fecha_factura=fecha_generado,
                desc_factura=f"Multa por cancelación de reserva en {data['parqueadero']}",
                precio_hora=f"${tarifamulta},0",
                cantidad="1",
                total=f"${tarifamulta},0",
                subtotal=f"${tarifamulta},0",
                fechagenerado=fecha_generado)
            mail.send(msg)
        
        # Eliminar la reserva
        sql_delete_reserva = "DELETE FROM reserva WHERE numreserva = %s"
        DatabaseFacade.execute_query(sql_delete_reserva, (data['numreserva'],))

        # Actualizar la capacidad del parqueadero
        sql_update_capacidad = "UPDATE parqueadero SET capacidadactual = capacidadactual + 1 WHERE nombreparqueadero = %s"
        DatabaseFacade.execute_query(sql_update_capacidad, (data['parqueadero'],))

        return jsonify({"message": "Reserva cancelada con éxito"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add other reserva-related routes here.

#Grafica de barras

@reserva_bp.route("/reservas_hoy/<idparqueadero>", methods=["GET"])
def reservas_hoy(idparqueadero):
    try:
        sql_query = """
        SELECT COUNT(*) AS cantidad_reservas
        FROM reserva
        WHERE fecharegistrada::date = CURRENT_DATE AND
              idparqueadero = %s;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        return jsonify({"cantidad_reservas": result[0][0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route("/reservas_ayer/<idparqueadero>", methods=["GET"])
def reservas_ayer(idparqueadero):
    try:
        sql_query = """
        SELECT COUNT(*) AS cantidad_reservas
        FROM reserva
        WHERE fecharegistrada::date = CURRENT_DATE - INTERVAL '1 day' AND
              idparqueadero = %s;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        return jsonify({"cantidad_reservas": result[0][0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route("/reservas_mes/<idparqueadero>", methods=["GET"])
def reservas_mes(idparqueadero):
    try:
        sql_query = """
        SELECT fecharegistrada::date AS fecha, COUNT(*) AS cantidad_reservas
        FROM reserva
        WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '1 month' AND
              idparqueadero = %s
        GROUP BY fecharegistrada::date
        ORDER BY fecharegistrada::date;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        reservas = [{"fecha": row[0], "cantidad_reservas": row[1]} for row in result]
        return jsonify(reservas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route("/reservas_tres_meses/<idparqueadero>", methods=["GET"])
def reservas_tres_meses(idparqueadero):
    try:
        sql_query = """
        SELECT fecharegistrada::date AS fecha, COUNT(*) AS cantidad_reservas
        FROM reserva
        WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '3 months' AND
              idparqueadero = %s
        GROUP BY fecharegistrada::date
        ORDER BY fecharegistrada::date;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        reservas = [{"fecha": row[0], "cantidad_reservas": row[1]} for row in result]
        return jsonify(reservas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#Grafica dispersion

@reserva_bp.route("/duracion_reservas_hoy/<idparqueadero>", methods=["GET"])
def duracion_reservas_hoy(idparqueadero):
    try:
        sql_query = """
        SELECT EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada))/3600 AS duracion_horas
        FROM reserva
        WHERE fecharegistrada::date = CURRENT_DATE AND
              idparqueadero = %s;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        duraciones = [row[0] for row in result]
        return jsonify(duraciones), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route("/duracion_reservas_ayer/<idparqueadero>", methods=["GET"])
def duracion_reservas_ayer(idparqueadero):
    try:
        sql_query = """
        SELECT EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada))/3600 AS duracion_horas
        FROM reserva
        WHERE fecharegistrada::date = CURRENT_DATE - INTERVAL '1 day' AND
              idparqueadero = %s;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        duraciones = [row[0] for row in result]
        return jsonify(duraciones), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route("/duracion_reservas_mes/<idparqueadero>", methods=["GET"])
def duracion_reservas_mes(idparqueadero):
    try:
        sql_query = """
        SELECT EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada))/3600 AS duracion_horas
        FROM reserva
        WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '1 month' AND
              idparqueadero = %s;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        duraciones = [row[0] for row in result]
        return jsonify(duraciones), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route("/duracion_reservas_tres_meses/<idparqueadero>", methods=["GET"])
def duracion_reservas_tres_meses(idparqueadero):
    try:
        sql_query = """
        SELECT EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada))/3600 AS duracion_horas
        FROM reserva
        WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '3 months' AND
              idparqueadero = %s;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        duraciones = [row[0] for row in result]
        return jsonify(duraciones), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#Grafica torta

@reserva_bp.route("/proporcion_reservas_hoy/<idparqueadero>", methods=["GET"])
def proporcion_reservas_hoy(idparqueadero):
    try:
        sql_query = """
        SELECT 
            CASE 
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 < 1 THEN 'Menos de 1 hora'
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 1 AND 2 THEN 'Entre 1 y 2 horas'
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 2 AND 4 THEN 'Entre 2 y 4 horas'
                ELSE 'Más de 4 horas'
            END AS duracion_reserva,
            COUNT(*) AS cantidad_reservas
        FROM reserva
        WHERE fecharegistrada::date = CURRENT_DATE AND
              idparqueadero = %s
        GROUP BY duracion_reserva
        ORDER BY cantidad_reservas DESC;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        proporciones = [{"duracion_reserva": row[0], "cantidad_reservas": row[1]} for row in result]
        return jsonify(proporciones), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reserva_bp.route("/proporcion_reservas_ayer/<idparqueadero>", methods=["GET"])
def proporcion_reservas_ayer(idparqueadero):
    try:
        sql_query = """
        SELECT 
            CASE 
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 < 1 THEN 'Menos de 1 hora'
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 1 AND 2 THEN 'Entre 1 y 2 horas'
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 2 AND 4 THEN 'Entre 2 y 4 horas'
                ELSE 'Más de 4 horas'
            END AS duracion_reserva,
            COUNT(*) AS cantidad_reservas
        FROM reserva
        WHERE fecharegistrada::date = CURRENT_DATE - INTERVAL '1 day' AND
              idparqueadero = %s
        GROUP BY duracion_reserva
        ORDER BY cantidad_reservas DESC;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        proporciones = [{"duracion_reserva": row[0], "cantidad_reservas": row[1]} for row in result]
        return jsonify(proporciones), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@reserva_bp.route("/proporcion_reservas_mes/<idparqueadero>", methods=["GET"])
def proporcion_reservas_mes(idparqueadero):
    try:
        sql_query = """
        SELECT 
            CASE 
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 < 1 THEN 'Menos de 1 hora'
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 1 AND 2 THEN 'Entre 1 y 2 horas'
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 2 AND 4 THEN 'Entre 2 y 4 horas'
                ELSE 'Más de 4 horas'
            END AS duracion_reserva,
            COUNT(*) AS cantidad_reservas
        FROM reserva
        WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '1 month' AND
              idparqueadero = %s
        GROUP BY duracion_reserva
        ORDER BY cantidad_reservas DESC;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        proporciones = [{"duracion_reserva": row[0], "cantidad_reservas": row[1]} for row in result]
        return jsonify(proporciones), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@reserva_bp.route("/proporcion_reservas_tres_meses/<idparqueadero>", methods=["GET"])
def proporcion_reservas_tres_meses(idparqueadero):
    try:
        sql_query = """
        SELECT 
            CASE 
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 < 1 THEN 'Menos de 1 hora'
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 1 AND 2 THEN 'Entre 1 y 2 horas'
                WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 2 AND 4 THEN 'Entre 2 y 4 horas'
                ELSE 'Más de 4 horas'
            END AS duracion_reserva,
            COUNT(*) AS cantidad_reservas
        FROM reserva
        WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '3 months' AND
              idparqueadero = %s
        GROUP BY duracion_reserva
        ORDER BY cantidad_reservas DESC;
        """
        result = DatabaseFacade.execute_query(sql_query, (idparqueadero,))
        proporciones = [{"duracion_reserva": row[0], "cantidad_reservas": row[1]} for row in result]
        return jsonify(proporciones), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500





"""
Posibles consultas para las estadisticas Grafica de Barras (donde X es la fecha, Y la cantidad de reservas):
    --- Cantidad de reservas hechas en el dia de hoy: 
            SELECT COUNT(*) AS cantidad_reservas
            FROM reserva
            WHERE fecharegistrada::date = CURRENT_DATE AND
                idparqueadero = %s;
    --- Cantidad de reservas hechas en el dia de ayer: 
            SELECT COUNT(*) AS cantidad_reservas
            FROM reserva
            WHERE fecharegistrada::date = CURRENT_DATE - INTERVAL '1 day' AND
                idparqueadero = %s;
    --- Cantidad de reservas hechas en este mes ordenadas por fechas:
            SELECT fecharegistrada::date AS fecha, COUNT(*) AS cantidad_reservas
            FROM reserva
            WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '1 month' AND
                idparqueadero = %s
            GROUP BY fecharegistrada::date
            ORDER BY fecharegistrada::date;
    --- Cantidad de reservas hechas en los ultimos tres meses ordenadas por fechas:
            SELECT fecharegistrada::date AS fecha, COUNT(*) AS cantidad_reservas
            FROM reserva
            WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '3 months' AND
                idparqueadero = %s
            GROUP BY fecharegistrada::date
            ORDER BY fecharegistrada::date;

            


Posibles consultas para las estadisticas Grafica de Dispersion (donde X es la reserva, Y la duracion de la reserva):
    --- Duracion de las reservas hechas en el dia de hoy:
            SELECT EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada))/3600 AS duracion_horas
            FROM reserva
            WHERE fecharegistrada::date = CURRENT_DATE AND
                idparqueadero = %s;
    --- Duracion de las reservas hechas en el dia de ayer:
            SELECT EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada))/3600 AS duracion_horas
            FROM reserva
            WHERE fecharegistrada::date = CURRENT_DATE - INTERVAL '1 day' AND
                idparqueadero = %s;
    --- Duracion de las reservas hechas en este mes:
            SELECT EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada))/3600 AS duracion_horas
            FROM reserva
            WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '1 month' AND
                idparqueadero = %s;
    --- Duracion de las reservas hechas en los ultimos tres meses:
            SELECT EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada))/3600 AS duracion_horas
            FROM reserva
            WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '3 months' AND
                idparqueadero = %s;

                


Posibles consultas para las estadisticas Grafica de Torta (Donde cada color representaria la proporción de reservas por duración):
    --- Proporción de reservas por duración (hoy):
            SELECT 
                CASE 
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 = 1 THEN '1 hora'
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 1 AND 2 THEN 'Entre 1 y 2 horas'
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 2 AND 4 THEN 'Entre 2 y 4 horas'
                    ELSE 'Más de 4 horas'
                END AS duracion_reserva,
                COUNT(*) AS cantidad_reservas
            FROM reserva
            WHERE fecharegistrada::date = CURRENT_DATE AND
                idparqueadero = %s
            GROUP BY duracion_reserva
            ORDER BY cantidad_reservas DESC;
    --- Proporción de reservas por duración (ayer):
            SELECT 
                CASE 
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 = 1 THEN '1 hora'
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 1 AND 2 THEN 'Entre 1 y 2 horas'
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 2 AND 4 THEN 'Entre 2 y 4 horas'
                    ELSE 'Más de 4 horas'
                END AS duracion_reserva,
                COUNT(*) AS cantidad_reservas
            FROM reserva
            WHERE fecharegistrada::date = CURRENT_DATE - INTERVAL '1 day' AND
                idparqueadero = %s
            GROUP BY duracion_reserva
            ORDER BY cantidad_reservas DESC;
    --- Proporción de reservas por duración (último mes):
            SELECT 
                CASE 
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 = 1 THEN '1 hora'
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 1 AND 2 THEN 'Entre 1 y 2 horas'
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 2 AND 4 THEN 'Entre 2 y 4 horas'
                    ELSE 'Más de 4 horas'
                END AS duracion_reserva,
                COUNT(*) AS cantidad_reservas
            FROM reserva
            WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '1 month' AND
                idparqueadero = %s
            GROUP BY duracion_reserva
            ORDER BY cantidad_reservas DESC;
    --- Proporción de reservas por duración (últimos tres meses):
            SELECT 
                CASE 
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 = 1 THEN '1 hora'
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 1 AND 2 THEN 'Entre 1 y 2 horas'
                    WHEN EXTRACT(EPOCH FROM (fechareservasalida - fechareservaentrada)) / 3600 BETWEEN 2 AND 4 THEN 'Entre 2 y 4 horas'
                    ELSE 'Más de 4 horas'
                END AS duracion_reserva,
                COUNT(*) AS cantidad_reservas
            FROM reserva
            WHERE fecharegistrada >= CURRENT_DATE - INTERVAL '3 months' AND
                idparqueadero = %s
            GROUP BY duracion_reserva
            ORDER BY cantidad_reservas DESC;
"""
import os
from flask import Blueprint, request, jsonify, render_template
from app.utils.db_utils import get_db_connection
from datetime import datetime, timedelta
from app.utils.payment_utils import process_payment
import math
from flask_mail import Mail, Message
from app import mail


reserva_bp = Blueprint('reserva', __name__, url_prefix='/reserva')

@reserva_bp.route("/crear_reserva", methods=["POST"])
def crear_reserva():
    data = request.get_json()
    try:
        conn = get_db_connection()
        conn.autocommit = False
        cur = conn.cursor()

        email = data['correoelectronico']
        
        # Obtener el máximo numreserva actual
        cur.execute("SELECT MAX(CAST(SUBSTRING(numreserva, 2) AS INTEGER)) FROM reserva")
        max_numreserva = cur.fetchone()[0]
        if max_numreserva is None:
            max_numreserva = 0

        nuevo_idreserva = 'R' + str(max_numreserva + 1).zfill(3)

        cur.execute("SELECT idusuario FROM usuario WHERE correoelectronico = %s", (email,))
        idusuario = cur.fetchone()
        if not idusuario:
            raise Exception("Usuario no encontrado")
        idusuario = idusuario[0]

        sql_query = """
            INSERT INTO reserva (numreserva, idusuario, idparqueadero, montototal, fechareservaentrada, fechareservasalida)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (nuevo_idreserva, idusuario, data['idparqueadero'], data['montototal'], data['fechareservaentrada'], data['fechareservasalida'])
        cur.execute(sql_query, values)
        cur.execute("UPDATE parqueadero SET capacidadactual = capacidadactual - 1 WHERE idparqueadero = %s", (data['idparqueadero'],))
        puntosUsuario = int(math.floor(data['montototal'] / 4000))
        cur.execute("UPDATE usuario SET puntosacumulados = puntosacumulados + %s WHERE correoelectronico = %s", (puntosUsuario, email))
        conn.commit()

        reserva = {"numreserva": nuevo_idreserva, "idusuario": idusuario, "idparqueadero": data['idparqueadero'],
                   "montototal": data['montototal'], "fechareservaentrada": data['fechareservaentrada'],
                   "fechareservasalida": data['fechareservasalida'], "puntos": puntosUsuario}
        return jsonify({"message": "Reserva creada con éxito", "reserva": reserva}), 201
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()


# Add other reserva-related routes here.

@reserva_bp.route("/pago_tarjeta", methods=["POST"])
def pago_tarjeta():
    try:
        # Connect to the PostgreSQL database
        #conn = DatabaseConnection.get_db_connection()
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

@reserva_bp.route("/get_reserva/<numreserva>", methods=["GET"])
def get_reserva(numreserva):
    try:
        conn = get_db_connection()
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

@reserva_bp.route("/buscar_reservas", methods=["GET"])
def buscar_reservas():
    correo_electronico = request.args.get('correo_electronico')
    
    if not correo_electronico:
        return jsonify({"error": "El correo electrónico es requerido"}), 400
    
    try:
        # Conectar a la base de datos PostgreSQL
        conn = get_db_connection()
        cur = conn.cursor()

        # Consulta SQL para obtener el IDUSUARIO a partir del correo electrónico
        sql_usuario_query = "SELECT idusuario FROM usuario WHERE correoelectronico = %s"
        cur.execute(sql_usuario_query, (correo_electronico,))
        usuario_result = cur.fetchone()

        if not usuario_result:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        idusuario = usuario_result[0]

        # Consulta SQL para obtener las reservas del usuario
        sql_reserva_query = "SELECT P.nombreparqueadero, R.fechareservaentrada, R.montototal, R.fechareservasalida, R.numreserva FROM reserva R, parqueadero P WHERE R.idusuario = %s and P.idparqueadero = R.idparqueadero ORDER BY R.fechareservaentrada DESC"
        cur.execute(sql_reserva_query, (idusuario,))
        reservas = cur.fetchall()


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

    finally:
        cur.close()
        conn.close()

@reserva_bp.route('/factura', methods=["POST"])
def factura():
    now = datetime.now()
    fecha_generado = now.strftime("%Y-%m-%d %H:%M:%S")
    data = request.get_json()

    msg = Message("Factura Reserva",
        sender=os.getenv("MAIL_USERNAME"),
        recipients=[data['correoelectronico']])

    msg.html = render_template('template.html', num_Factura = data['numfactura'],
        nombre_cliente = data['nombre_cliente'],
        fecha_factura = fecha_generado,
        desc_factura = f"Reserva en {data['parqueadero']}",
        precio_hora = f"${data['tarifa']},0",
        cantidad = f"{data['cantidadhoras']} horas",
        total = f"${data['montototal']},0",
        subtotal = f"${data['montototal']},0",
        fechagenerado = fecha_generado)
    mail.send(msg)
    return jsonify({"message": "Factura mandada correctamente"}), 200


@reserva_bp.route('/cancelar_reserva', methods=["DELETE"])
def cancelar_reserva():
    now = datetime.now() + timedelta(minutes=30)

    data = request.get_json()

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Obtener la fecha de reserva entrada
        cur.execute("SELECT fechareservaentrada, idusuario FROM reserva WHERE numreserva = %s", (data['numreserva'],))
        reserva_info = cur.fetchone()
        if not reserva_info:
            return jsonify({"error": "Reserva no encontrada"}), 404
        
        fechareservaentrada = reserva_info[0]
        idusuario = reserva_info[1]

        cur.execute("SELECT tarifamulta FROM parqueadero WHERE nombreparqueadero = %s", (data['parqueadero'],))
        tarifamulta = cur.fetchone()[0]

        print(now, fechareservaentrada)
        
        # Verificar si la fecha actual es anterior en 30 minutos a la fecha de reserva entrada
        if now > fechareservaentrada - timedelta(minutes=30):
            # send_email(correo_usuario, "Cancelación de Reserva", "Su reserva ha sido cancelada con éxito.")
            fecha_generado = now.strftime("%Y-%m-%d %H:%M:%S")
            msg = Message("Factura Multa",
            sender=os.getenv("MAIL_USERNAME"),
            recipients=[data['correoelectronico']])

            msg.html = render_template('template.html', num_Factura = data['numfactura'],
                nombre_cliente = data['nombre_cliente'],
                fecha_factura = fecha_generado,
                desc_factura = f"Multa por cancelacion de reserva en {data['parqueadero']}",
                precio_hora = f"${tarifamulta},0",
                cantidad = f"1",
                total = f"${tarifamulta},0",
                subtotal = f"${tarifamulta},0",
                fechagenerado = fecha_generado)
            mail.send(msg)
        
        # Eliminar la reserva
        sql_query = "DELETE FROM reserva WHERE numreserva = %s"
        cur.execute(sql_query, (data['numreserva'],))

        # Actualizar la capacidad del parqueadero
        cur.execute("UPDATE parqueadero SET capacidadactual = capacidadactual + 1 WHERE nombreparqueadero = %s", (data['parqueadero'],))

        conn.commit()
        
        return jsonify({"message": "Reserva cancelada con éxito"}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

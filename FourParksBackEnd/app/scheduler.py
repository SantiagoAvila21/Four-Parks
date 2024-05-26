from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from app.utils.db_utils import *
import atexit

def revisar_reservas():
    try:
        now = datetime.now()

        # Seleccionar reservas que han terminado y no han sido procesadas
        sql_query_terminadas = """
            SELECT numreserva, idparqueadero
            FROM reserva
            WHERE fechareservasalida <= %s AND procesada_salida = FALSE
        """
        reservas_terminadas = DatabaseFacade.execute_query(sql_query_terminadas, (now,))

        for reserva in reservas_terminadas:
            numreserva = reserva[0]
            idparqueadero = reserva[1]

            # Actualizar la capacidad del parqueadero (Se libera un espacio)
            DatabaseFacade.execute_query("""
                UPDATE parqueadero
                SET capacidadactual = capacidadactual + 1
                WHERE idparqueadero = %s
            """, (idparqueadero,))

            # Marcar la reserva como procesada para salida (Se marca como procesada, para no realizar dobles verificaciones)
            DatabaseFacade.execute_query("""
                UPDATE reserva
                SET procesada_salida = TRUE
                WHERE numreserva = %s
            """, (numreserva,))
        
        # Seleccionar reservas que han comenzado y no han sido procesadas
        sql_query_iniciadas = """
            SELECT numreserva, idparqueadero
            FROM reserva
            WHERE fechareservaentrada <= %s AND procesada_entrada = FALSE
        """
        reservas_iniciadas = DatabaseFacade.execute_query(sql_query_iniciadas, (now,))

        for reserva in reservas_iniciadas:
            numreserva = reserva[0]
            idparqueadero = reserva[1]

            # Actualizar la capacidad del parqueadero (Se ocupa un espacio)
            DatabaseFacade.execute_query("""
                UPDATE parqueadero
                SET capacidadactual = capacidadactual - 1
                WHERE idparqueadero = %s
            """, (idparqueadero,))

            # Marcar la reserva como procesada para entrada (Se marca como procesada, para no realizar dobles verificaciones)
            DatabaseFacade.execute_query("""
                UPDATE reserva
                SET procesada_entrada = TRUE
                WHERE numreserva = %s
            """, (numreserva,))
    except Exception as e:
        print(f"Error: {e}")

scheduler = BackgroundScheduler()
scheduler.add_job(func=revisar_reservas, trigger="interval", hours=1)
scheduler.start()

# Para asegurarse de que el scheduler se apague al detener la aplicación
atexit.register(lambda: scheduler.shutdown())

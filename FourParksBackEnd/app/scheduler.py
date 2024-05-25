from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
#from app.utils.db_utils import get_db_connection 
from app.utils.db_utils import *
import atexit

def revisar_reservas():
    try:
        now = datetime.now()

        # Seleccionar reservas que han terminado
        sql_query = """
            SELECT numreserva, idparqueadero
            FROM reserva
            WHERE fechareservasalida < %s
        """
        reservas_terminadas = DatabaseFacade.execute_query(sql_query, (now,))

        # Actualizar la capacidad de los parqueaderos
        for reserva in reservas_terminadas:
            numreserva = reserva[0]
            idparqueadero = reserva[1]

            # Actualizar la capacidad del parqueadero
            DatabaseFacade.execute_query("""
                UPDATE parqueadero
                SET capacidadactual = capacidadactual + 1
                WHERE idparqueadero = %s
            """, (idparqueadero,))
    except Exception as e:
        print(f"Error: {e}")

scheduler = BackgroundScheduler()
scheduler.add_job(func=revisar_reservas, trigger="interval", hours=1)
scheduler.start()

# Para asegurarse de que el scheduler se apague al detener la aplicación
atexit.register(lambda: scheduler.shutdown())

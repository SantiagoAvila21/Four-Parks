from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
#from app.utils.db_utils import get_db_connection 
import atexit

def revisar_reservas():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        now = datetime.now()

        # Seleccionar reservas que han terminado
        cur.execute("""
            SELECT numreserva, idparqueadero
            FROM reserva
            WHERE fechareservasalida < %s
        """, (now,))
        reservas_terminadas = cur.fetchall()

        # Actualizar la capacidad de los parqueaderos
        for reserva in reservas_terminadas:
            numreserva = reserva[0]
            idparqueadero = reserva[1]

            # Actualizar la capacidad del parqueadero
            cur.execute("""
                UPDATE parqueadero
                SET capacidadactual = capacidadactual + 1
                WHERE idparqueadero = %s
            """, (idparqueadero,))

        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

scheduler = BackgroundScheduler()
scheduler.add_job(func=revisar_reservas, trigger="interval", hours=1)
scheduler.start()

# Para asegurarse de que el scheduler se apague al detener la aplicación
atexit.register(lambda: scheduler.shutdown())

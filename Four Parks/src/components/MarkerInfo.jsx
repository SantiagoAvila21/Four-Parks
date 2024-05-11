import './styles/Markerinfo.css'
import { useAuth } from '../Context/AuthProvider'

const MarkerInfo = ({ info }) => {
  const auth = useAuth();

  const tipoPark = info.tipo === 1 ? "Cubierto" :
              info.tipo === 2 ? "Semi-cubierto" :
              info.tipo === 3 ? "Descubierto" : "";

  return (
    <>
      <h3>{info.nombreParqueadero}</h3>
      <p>{info.direccion}</p>
      <p>Tipo: {tipoPark}</p>
      <p>Available Spaces: {info.espacioActual}</p>
      {auth.user && <button id="btnReservar">Reservar</button>}
    </>
  )
}

export default MarkerInfo
import '../styles/Markerinfo.css'
import { useAuth } from '../Context/AuthProvider'
import { Link } from 'react-router-dom';

/* eslint-disable react/prop-types */
const MarkerInfo = ({ info }) => {
  const auth = useAuth();

  const tipoPark = info.tipo === 1 ? "Cubierto" :
              info.tipo === 2 ? "Semi-cubierto" :
              info.tipo === 3 ? "Descubierto" : "";

  return (
    <>
      <h4>{info.nombreParqueadero}</h4>
      <p>{info.direccion}</p>
      <p>Tipo: {tipoPark}</p>
      <p>Espacios disponibles: {info.espacioActual}</p>
      {auth.user && <Link to='/reserva' state={{nombreParqueadero: info.nombreParqueadero}}><button id="btnReservar">Reservar</button></Link>}
    </>
  )
}

export default MarkerInfo
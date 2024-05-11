import './styles/Markerinfo.css'
import { useAuth } from '../Context/AuthProvider'

const MarkerInfo = () => {
  const auth = useAuth();
  return (
    <>
      <h3>Parqueadero-cc Andino</h3>
      <p>Address: dl 85 #45-30c</p>
      <p>Type: Cubierto</p>
      <p>Available Spaces: ###</p>
      {auth.user && <button id="btnReservar">Reservar</button>}
    </>
  )
}

export default MarkerInfo
import './styles/Sidebar.css'
import parkImg from '../assets/Parkimg.png'
import { IoMdHelpCircleOutline } from "react-icons/io";
import { FaParking } from "react-icons/fa";
import { useMarkerContext } from '../Context/MarkerProvider';

const Sidebar = () => {
  const handleChange = () => {
    console.log("Holitas");
  }

  const { setSelectedMarkerPosition } = useMarkerContext();

  const handleMarkerButtonClick = (position) => {
    setSelectedMarkerPosition(position);
  };

  return (
    <div className="sidebar">
        <img src={parkImg} alt='Imagen Parqueadero' />
        <div className="filter">
          <select name="tipoParqueadero" defaultValue={""} onChange={handleChange} className="tipoParqueadero">
            <option value="">Tipo de parqueadero</option>
            <option value={"1"}>Cubierto</option>
            <option value={"2"}>Semi-Cubierto</option>
            <option value={"3"}>Descubierto</option>
          </select>
        </div>
        
        <div className='parqueaderos-container'>
          <div className="parqueaderos">
              <a onClick={() => handleMarkerButtonClick([4.62958, -74.065738])}> <FaParking /> Parqueadero 1 </a>
              <a onClick={() => handleMarkerButtonClick([4.60971, -74.08175])}> <FaParking /> Parqueadero 2 </a>
              <a onClick={() => handleMarkerButtonClick([4.648283, -74.077133])}> <FaParking /> Parqueadero 3 </a>
              <a onClick={() => handleMarkerButtonClick([4.63615, -74.06856])}> <FaParking /> Parqueadero 4 </a>
              <a onClick={() => handleMarkerButtonClick([4.60971, -74.06606])}> <FaParking /> Parqueadero 5 </a>
              <a onClick={() => handleMarkerButtonClick([4.62958, -74.065738])}> <FaParking /> Parqueadero 1 </a>
              <a onClick={() => handleMarkerButtonClick([4.60971, -74.08175])}> <FaParking /> Parqueadero 2 </a>
              <a onClick={() => handleMarkerButtonClick([4.648283, -74.077133])}> <FaParking /> Parqueadero 3 </a>
              <a onClick={() => handleMarkerButtonClick([4.63615, -74.06856])}> <FaParking /> Parqueadero 4 </a>
              <a onClick={() => handleMarkerButtonClick([4.60971, -74.06606])}> <FaParking /> Parqueadero 5 </a>
          </div>
        </div>

        <div id="botonAyuda" className="botonAyuda">
          <IoMdHelpCircleOutline />
          <p>Ayuda</p>
        </div>
        
    </div>
  )
}

export default Sidebar
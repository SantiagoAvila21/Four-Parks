import '../styles/Sidebar.css'
import parkImg from '../assets/Parkimg.png'
import { IoMdHelpCircleOutline } from "react-icons/io";
import { FaParking } from "react-icons/fa";
import { useMarkerContext } from '../Context/MarkerProvider';
import { useParking } from '../Context/ParkingsProvider';
import { CircularProgress } from "@mui/material";

const Sidebar = () => {
  const parking = useParking();

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
        
        {parking.isLoading && 
          <div id="loadingDiv">
            <CircularProgress />
          </div>
        }

        <div className='parqueaderos-container' >
          {!parking.isLoading && 
            <div className="parqueaderos">
              {parking.parqueaderos.map((parqueadero) => {
                return <a key={parqueadero[0]} onClick={() => handleMarkerButtonClick([parqueadero[8], parqueadero[7]])}> <FaParking /> {parqueadero[2]} </a>
              })}
            </div> 
          }
        </div>

        <div id="botonAyuda" className="botonAyuda">
          <IoMdHelpCircleOutline />
          <p>Ayuda</p>
        </div>
        
    </div>
  )
}

export default Sidebar
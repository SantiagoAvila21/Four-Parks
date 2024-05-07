import './styles/Sidebar.css'
import parkImg from '../assets/Parkimg.png'
import { IoMdHelpCircleOutline } from "react-icons/io";


const Sidebar = () => {
  const handleChange = () => {
    console.log("Holitas");
  }


  return (
    <div className="sidebar">
        <img src={parkImg} alt='Imagen Parqueadero' />
        <div className="filter">
          <select name="tipoParqueadero" defaultValue={""} onChange={handleChange} className="tipoParqueadero">
            <option value="" disabled>Tipo de parqueadero</option>
            <option value={"1"}>Cubierto</option>
            <option value={"2"}>Semi-Cubierto</option>
            <option value={"3"}>Descubierto</option>
          </select>
        </div>

        <div id="botonAyuda" className="botonAyuda">
          <IoMdHelpCircleOutline />
          <p>Ayuda</p>
        </div>
        
    </div>
  )
}

export default Sidebar
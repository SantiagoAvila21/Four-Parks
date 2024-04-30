import './styles/Sidebar.css'
import { FaCar } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";

const Sidebar = () => {
  return (
    <div className="sidebar">
        <p> <FaCar /> Parqueaderos</p>
        <p> <FaShoppingCart/> Reservas</p>
        <p> <IoNotifications/> Notificaciones</p>
        <p> <IoIosHelpCircleOutline /> Ayuda</p>
    </div>
  )
}

export default Sidebar
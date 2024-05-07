import "./styles/Topbar.css";
import { Link } from 'react-router-dom'
import logoFP from '../assets/FourParksLogo.png'

const TopBar = () => {
    return (
        <div className="topbar">
            <img id="logoTop" src={logoFP} alt="Logo Four Parks" />
            <p id="nombreEmpresa">Four Parks</p>
            <div className="botonesLogin">
                <Link style={{ textDecoration: 'none' }} to="/login" id="loginLink">Iniciar sesión</Link>
                <Link style={{ textDecoration: 'none' }} to="/register" id="registerLink">Registrarse</Link>
            </div>
        </div>
    );
}

export default TopBar;
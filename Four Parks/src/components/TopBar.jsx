import "./styles/Topbar.css";
import { Link } from 'react-router-dom'

const TopBar = () => {
    return (
        <div className="topbar">
            <p>Logo</p>
            <p id="nombreEmpresa">Four Parks</p>
            <div className="botonesLogin">
                <Link to="/login"><a>Iniciar sesion</a></Link>
                <Link to="/register"><a>Registrarse</a></Link>
            </div>
        </div>
    );
}

export default TopBar;
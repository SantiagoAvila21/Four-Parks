import "./styles/Topbar.css";
import { Link } from 'react-router-dom';
import { useState } from "react";
import logoFP from '../assets/FourParksLogo.png';
import { useAuth } from "../Context/AuthProvider";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp  } from "react-icons/io";
import Account from "./Account";


const TopBar = () => {
    const { user } = useAuth();
    const [isAccountVisible, setIsAccountVisible] = useState(false);

    return (
        <div className="topbar">
            <img id="logoTop" src={logoFP} alt="Logo Four Parks" />
            <p id="nombreEmpresa">Four Parks</p>
            {user ? 
                <div className="infoUser">
                    <Link style={{ textDecoration: 'none' }} to="/reserva" id="reservaLink">Mis Reservas</Link>
                    <>
                        <div className="account">
                            <p>Hola, {user.split('_')[0]}</p>
                            <p id="myAccount" onClick={() => setIsAccountVisible((prev) => !prev)}> Mi cuenta {isAccountVisible ? <IoIosArrowUp /> : <IoIosArrowDown />} </p>
                            {isAccountVisible && <Account />}
                        </div>
                        <FaUserCircle size={50}/>
                    </>
                </div> 
            :
                <div className="botonesLogin">
                    <Link style={{ textDecoration: 'none' }} to="/login" id="loginLink">Iniciar sesión</Link>
                    <Link style={{ textDecoration: 'none' }} to="/register" id="registerLink">Registrarse</Link>
                </div>
            }
        </div>
    );
}

export default TopBar;
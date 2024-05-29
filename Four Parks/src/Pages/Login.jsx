import { useEffect, useState } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/Login.css"
import 'react-toastify/dist/ReactToastify.css';
import Modal from "../components/Modal";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import { useAuth } from "../Context/AuthProvider";
import { Link } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";



const Login = () => {
    const { updateNotification } = useNotification();
    const auth = useAuth();

    useEffect(() => {
        if(auth.state == 'registered') updateNotification({type: "info", message: "Se ha mandado la contraseña al correo proporcionado."});
        auth.setState("");
    },[]); // eslint-disable-line react-hooks/exhaustive-deps

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setshowModal] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');


    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    }

    const onChangeCode = (event) => {
        setTwoFactorCode(event.target.value);
    }
    
    const onChangePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleLogin = (event) => {
        event.preventDefault();
        // Revisar si el formulario tiene datos
        if(email == "" || password == ""){
            updateNotification({ type: 'error', message: 'Hay al menos un espacio en blanco' });
            return;
        }
        // Revisar El Regex del correo Electronico
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // eslint-disable-line

        if(!emailRegex.test(email)){
            updateNotification({ type: 'error', message: 'Por favor ingrese un email válido' });
            return;
        }
        auth.loginAction({email: email, password: password}, () => {setshowModal((prev) => !prev)});

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(twoFactorCode == '' || twoFactorCode.length != 6){
            updateNotification({ type: 'error', message: 'Ingrese el codigo enviado al correo' });
            return;
        }

        auth.verifyCode(twoFactorCode, email);
    }

    return (
        <div className="Login">
            <Modal shouldShow={showModal} close onRequestClose={() => {
                    setshowModal((prev) => !prev);
            }}>
                <div className="twoFactor">
                    <p>Se ha enviado un código de verificación al correo electrónico proporcionado</p>
                    <input 
                        type="password" 
                        value={twoFactorCode} 
                        onChange={onChangeCode}
                        className="inputForm"  
                        placeholder="Código 6 digitos"
                        maxLength={6}
                    />
                    <button id="submitButton" type="submit" onClick={handleSubmit}>Verificar</button>
                </div>
            </Modal>
            <SideLogo />
            <div className="login Page">
                <h1>INICIAR SESIÓN</h1>
                <div className="login Form">
                    <form>
                        <div className="login info" style={{ position: "relative" }}>
                            <label>CORREO ELECTRÓNICO</label>
                            <input 
                                type="text" 
                                value={email} 
                                onChange={onChangeEmail} 
                                className="inputForm"
                                style={{ paddingLeft: '30px' }}
                            />
                            <MdEmail style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />
                        </div>
                        <div className="login info" style={{ position: "relative" }}>
                            <label>CONTRASEÑA</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={onChangePassword}
                                className="inputForm"  
                                style={{ paddingLeft: '30px' }}
                            />
                            <RiLockPasswordFill style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />
                        </div>
                    </form>
                    <Link to="/register"> No tienes cuenta? Registrate aquí</Link>
                </div>
                <button id="submitButton" type="submit" onClick={handleLogin}>Iniciar sesión</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login;
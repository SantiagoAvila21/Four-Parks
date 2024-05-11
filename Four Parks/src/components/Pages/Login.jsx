import { useState } from "react";
import SideLogo from "../SideLogo";
import "../styles/Login.css"
import 'react-toastify/dist/ReactToastify.css';
import Modal from "../Modal";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import { useAuth } from "../../Context/AuthProvider";


const Login = () => {

    const {updateNotification} = useNotification();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setshowModal] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');

    const auth = useAuth();

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
        updateNotification({ type: 'success', message: 'Sesión iniciada correctamente!' });
        console.log(twoFactorCode);
        setshowModal((prev) => !prev);
    }

    return (
        <div className="Login">
            <Modal shouldShow={showModal} onRequestClose={() => {
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
                    />
                    <button id="submitButton" type="submit" onClick={handleSubmit}>Verificar</button>
                </div>
            </Modal>
            <SideLogo />
            <div className="login Page">
                <h1>INICIAR SESIÓN</h1>
                <div className="login Form">
                    <form>
                        <div className="login info">
                            <label>CORREO ELECTRÓNICO</label>
                            <input 
                                type="text" 
                                value={email} 
                                onChange={onChangeEmail} 
                                className="inputForm"
                            />
                        </div>
                        <div className="login info">
                            <label>CONTRASEÑA</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={onChangePassword}
                                className="inputForm"  
                            />
                        </div>
                    </form>
                </div>
                <button id="submitButton" type="submit" onClick={handleLogin}>Iniciar sesión</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login;
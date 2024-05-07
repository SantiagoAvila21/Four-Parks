import { useState } from "react";
import SideLogo from "../SideLogo";
import "../styles/Login.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "../Modal";

const Login = () => {
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
            toast.error('Hay campos vacios en el formulario', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        // Revisar El Regex del correo Electronico
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // eslint-disable-line

        if(!emailRegex.test(email)){
            toast.error('Porfavor ingrese un email valido', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        setshowModal((prev) => !prev);
        console.log(`Email y Password: ${email} ${password}`);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        toast.success('Inicio sesion correctamente!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
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
                        placeholder="Codigo 6 digitos"
                    />
                    <button id="submitButton" type="submit" onClick={handleSubmit}>Verificar</button>
                </div>
            </Modal>
            <SideLogo />
            <div className="login Page">
                <h1>INICIAR SESION</h1>
                <div className="login Form">
                    <form>
                        <div className="login info">
                            <label>CORREO ELECTRONICO</label>
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
import { useState } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/Register.css";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import { useAuth } from "../Context/AuthProvider";
import { MdEmail } from "react-icons/md";
import { FaIdCard } from "react-icons/fa";



const Register = () => {

    const auth = useAuth();
    const {updateNotification} = useNotification();

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        tipoDoc: '',
        numDoc: '',
        email: ''
    });

    const handleChangeForm = (event) => {
        const { name, value } = event.target;
        setFormulario(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(Object.values(formulario).includes('')){
            updateNotification({ type: 'error', message: 'Hay al menos un espacio en blanco' });
            return;
        }
        // Revisar El Regex del correo Electronico
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // eslint-disable-line

        if(!emailRegex.test(formulario.email)){
            updateNotification({ type: 'error', message: 'Porfavor ingrese un email válido' });
            return;
        }
        auth.registerAction(formulario);
    }

    return (
        <div className="Register">
            <SideLogo />
            <div className="register Page">
                <h1>CREA UNA CUENTA</h1>
                <div className="register Form">
                    <form>
                        <div className="register info">
                            <label>NOMBRE</label>
                            <input 
                                type="text" 
                                name="nombre"
                                value={formulario.nombre} 
                                onChange={handleChangeForm} 
                                className="inputForm"
                            />
                        </div>
                        <div className="register info">
                            <label>APELLIDO</label>
                            <input 
                                type="text" 
                                name="apellido"
                                value={formulario.apellido} 
                                onChange={handleChangeForm} 
                                className="inputForm"
                            />
                        </div>
                        <div className="register info">
                            <label>TIPO DOCUMENTO</label>
                            <select name="tipoDoc" onChange={handleChangeForm} className="inputForm">
                                <option value={""}>Seleccione un tipo de documento</option>
                                <option value={"CC"}>Cédula</option>
                                <option value={"TI"}>Tarjeta de identidad</option>
                                <option value={"TE"}>Tarjeta de Extranjería</option>
                                <option value={"CE"}>Cédula de extranjería</option>
                                <option value={"NIT"}>Nit</option>
                                <option value={"PAS"}>Pasaporte</option>
                            </select>
                        </div>
                        <div className="register info" style={{ position: "relative" }}>
                            <label>NÚMERO DOCUMENTO</label>
                            <input 
                                type="text" 
                                name="numDoc"
                                value={formulario.numDoc} 
                                onChange={handleChangeForm} 
                                className="inputForm"
                                style={{ paddingLeft: '30px' }}
                            />
                            <FaIdCard style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />
                        </div>
                        <div className="register info" style={{ position: "relative" }}>
                            <label>CORREO ELECTRÓNICO</label>
                            <input 
                                type="text" 
                                name="email"
                                value={formulario.email} 
                                onChange={handleChangeForm} 
                                className="inputForm"
                                style={{ paddingLeft: '30px' }}
                            />
                            <MdEmail style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />
                        </div>
                    </form>
                </div>
                <button id="submitButton" type="submit" onClick={handleSubmit}>CREAR CUENTA</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Register;
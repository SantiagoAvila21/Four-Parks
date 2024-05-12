import { useState } from "react";
import SideLogo from "../SideLogo";
import "../styles/Register.css";
import axios from 'axios';
import sha1 from 'sha1';
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";

const Register = () => {

    const {updateNotification} = useNotification();

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        tipoDoc: '',
        numDoc: '',
        email: '',
        password: ''
    });

    const validatePassword = (password) => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return regex.test(password);
      };

    const handleChangeForm = (event) => {
        const { name, value } = event.target;
        setFormulario(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleSubmit = async (event) => {
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

        if(!validatePassword(formulario.password)){
            updateNotification({ type: 'error', message: 'La contraseña debe tener al menos 8 caracteres y contener al menos un número, una letra minúscula y una letra mayúscula.' });
            return;
        }

        try{
            const responseRegister = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/register`, {
                idtipousuario: "3",
                idtipodocumento: formulario.tipoDoc,
                nombreusuario: `${formulario.nombre}_${formulario.apellido}`,
                numdocumento: formulario.numDoc,
                contrasenia: sha1(formulario.password),
                puntosacumulados: 0,
                correoelectronico: formulario.email
            });
            if(responseRegister.status == 201){
                updateNotification({ type: 'success', message: 'Cuenta creada satisfactoriamente' });
            }
            console.log(responseRegister);
        }catch(error){
            console.log("Error de la solicitud: ", error.response.data.error)
            updateNotification({ type: 'error', message: error.response.data.error });
        }
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
                        <div className="register info">
                            <label>NÚMERO DOCUMENTO</label>
                            <input 
                                type="text" 
                                name="numDoc"
                                value={formulario.numDoc} 
                                onChange={handleChangeForm} 
                                className="inputForm"
                            />
                        </div>
                        <div className="register info">
                            <label>CORREO ELECTRÓNICO</label>
                            <input 
                                type="text" 
                                name="email"
                                value={formulario.email} 
                                onChange={handleChangeForm} 
                                className="inputForm"
                            />
                        </div>
                        <div className="register info">
                            <label>CONTRASEÑA</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formulario.password} 
                                onChange={handleChangeForm}
                                className="inputForm"  
                            />
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
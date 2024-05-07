import { useState } from "react";
import SideLogo from "../SideLogo";
import "../styles/Register.css"
import { toast } from 'react-toastify';
import axios from 'axios';
import sha1 from 'sha1';
import { ToastContainer } from "react-toastify";

const Register = () => {

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
            toast.error('Hay al menos un espacio en blanco', {
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

        if(!emailRegex.test(formulario.email)){
            toast.error('Porfavor ingrese un email válido', {
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

        if(!validatePassword(formulario.password)){
            toast.error('La contraseña debe tener al menos 8 caracteres y contener al menos un número, una letra minúscula y una letra mayúscula.', {
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
                toast.success('Cuenta creada satisfactoriamente', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            console.log(responseRegister);
        }catch(error){
            console.log("Error de la solicitud: ", error.response.data.error)
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
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
                <button id="submitButton" type="submit" onClick={handleSubmit}>Crear Cuenta</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Register;
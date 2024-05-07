import { useState } from "react";
import SideLogo from "../SideLogo";
import "../styles/Register.css"

const Login = () => {
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        tipoDoc: '',
        numDoc: '',
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormulario(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`${JSON.stringify(formulario)}`);
        if(Object.values(formulario).includes('')){
            console.log('Hay almenos un espacio en blanco');
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
                                onChange={handleChange} 
                                className="inputForm"
                            />
                        </div>
                        <div className="register info">
                            <label>APELLIDO</label>
                            <input 
                                type="text" 
                                name="apellido"
                                value={formulario.apellido} 
                                onChange={handleChange} 
                                className="inputForm"
                            />
                        </div>
                        <div className="register info">
                            <label>TIPO DOCUMENTO</label>
                            <select name="tipoDoc" onChange={handleChange} className="inputForm">
                                <option value={""}>Cedula Ciudadania</option>
                                <option value={"CC"}>Cedula Ciudadania</option>
                                <option value={"TI"}>Tarjeta Identidad</option>
                            </select>
                        </div>
                        <div className="register info">
                            <label>NUMERO DOCUMENTO</label>
                            <input 
                                type="text" 
                                name="numDoc"
                                value={formulario.numDoc} 
                                onChange={handleChange} 
                                className="inputForm"
                            />
                        </div>
                        <div className="register info">
                            <label>CORREO ELECTRONICO</label>
                            <input 
                                type="text" 
                                name="email"
                                value={formulario.email} 
                                onChange={handleChange} 
                                className="inputForm"
                            />
                        </div>
                        <div className="register info">
                            <label>CONTRASEÑA</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formulario.password} 
                                onChange={handleChange}
                                className="inputForm"  
                            />
                        </div>
                    </form>
                </div>
                <button id="submitButton" type="submit" onClick={handleSubmit}>Crear Cuenta</button>
            </div>
        </div>
    )
}

export default Login;
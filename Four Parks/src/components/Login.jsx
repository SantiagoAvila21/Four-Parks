import { useState } from "react";
import SideLogo from "./SideLogo";
import "./styles/Login.css"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
      
    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    }
    
    const onChangePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Jeje");
    }

    return (
        <div className="Login">
            <SideLogo />
            <div className="login Page">
                <h1>Iniciar Sesion</h1>
                <div className="login Form">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Correo Electronico:</label>
                            <input 
                            type="text" 
                            value={email} 
                            onChange={onChangeEmail} 
                            placeholder="Ingrese su nombre de usuario" 
                            />
                        </div>
                    <div>
                        <label>Contraseña:</label>
                        <input 
                        type="password" 
                        value={password} 
                        onChange={onChangePassword} 
                        placeholder="Ingrese su contraseña" 
                        />
                    </div>
                    <button type="submit">Iniciar sesión</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
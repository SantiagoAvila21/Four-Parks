import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useNotification from '../components/Hooks/useNotification';
import axios from 'axios';

const AuthContext = createContext();

/* eslint-disable react/prop-types */
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const {updateNotification} = useNotification();

    useEffect(() => {
        // Comprobar si hay un usuario almacenado en el localStorage al iniciar la aplicación
        const userFromLocalStorage = localStorage.getItem("userLogged");
        if (userFromLocalStorage) {
            setUser(userFromLocalStorage); // Convertir la cadena JSON almacenada en el localStorage de nuevo a un objeto
        }
    }, []);

    const loginAction = async (data, cb) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/login`, {
              correoelectronico: data.email,
              contrasenia: data.password
            });
      
            console.log('Respuesta del servidor:', response);
            if(response.status == 200){
                setUser(response.data.usuario);
                localStorage.setItem("userLogged", response.data.usuario);
                cb();
                // TO DO, despues de verificar el Codigo mandado, se hace el navigate(/);
                navigate("/");
                return;
            }
          } catch (error) {
            console.error("Error de la solicitud: ", error.response.data.error)
            updateNotification({ type: 'error', message: error.response.data.error });
        }
    }

    const logOut = () => {
        setUser(null);
        localStorage.removeItem("userLogged");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value = {{ user, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useNotification from '../Hooks/useNotification';
import axios from 'axios';

const AuthContext = createContext();

/* eslint-disable react/prop-types */
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [state, setState] = useState("");
    const navigate = useNavigate();
    const { updateNotification, closeNoti } = useNotification();

    // Comprobar si hay un usuario almacenado en el localStorage al iniciar la aplicación
    useEffect(() => {
        const userFromLocalStorage = localStorage.getItem("userLogged");
        if (userFromLocalStorage) {
            setUser(userFromLocalStorage); // Convertir la cadena JSON almacenada en el localStorage de nuevo a un objeto
        }
    }, []);

    // Función para realizar la acción de inicio de sesión
    const loginAction = async (data, cb) => {
        // Notificación de carga mientras se procesa la solicitud
        updateNotification({type: 'loading', message: 'Cargando...'});
        try {
            // Realizar la solicitud de inicio de sesión al servidor
            const response = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/login`, {
                correoelectronico: data.email,
                contrasenia: data.password
            });
        
            console.log('Respuesta del servidor:', response);
            // Si la solicitud es exitosa
            if(response.status == 200){
                // Cerrar la notificación de carga
                closeNoti();
                // Llamar a la función de callback proporcionada
                cb();
                return;
            }
        } catch (error) {
            // Cerrar la notificación de carga en caso de error
            closeNoti();
            console.error("Error de la solicitud: ", error.response.data.error)
            // Actualizar la notificación con el error recibido
            updateNotification({ type: 'error', message: error.response.data.error });
        }
        // Cerrar la notificación después de completar la acción
        closeNoti();
    }

    // Función para verificar el código de verificación
    const verifyCode = async (code, email) => {
        // Notificación de carga mientras se procesa la solicitud
        updateNotification({type: 'loading', message: 'Cargando...'});
        try {
            // Realizar la solicitud de verificación al servidor
            const response = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/verify`, {
                correoelectronico: email,
                codigo: code
            });
            // Si la verificación es exitosa
            if(response.status == 200){
                // Cerrar la notificación de carga
                closeNoti();
                // Establecer el usuario y almacenarlo en el almacenamiento local
                setUser(response.data.usuario);
                localStorage.setItem("userLogged", response.data.usuario);
                // Cambiar el estado de la aplicación a "logged"
                setState('logged');
                // Redirigir a la página de inicio
                navigate("/");
                return;
            }
        } catch (error) {
            // Cerrar la notificación de carga en caso de error
            closeNoti();
            console.error("Error de la solicitud: ", error.response.data.error)
            // Actualizar la notificación con el error recibido
            updateNotification({ type: 'error', message: error.response.data.error });
        }
    }

    // Función para realizar la acción de registro de usuario
    const registerAction = async(data) => {
        // Notificación de carga mientras se procesa la solicitud
        updateNotification({type: 'loading', message: 'Cargando...'});
        try{
            // Realizar la solicitud de registro al servidor
            const responseRegister = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/register`, {
                idtipousuario: "3",
                idtipodocumento: data.tipoDoc,
                nombreusuario: `${data.nombre}_${data.apellido}`,
                numdocumento: data.numDoc,
                puntosacumulados: 0,
                correoelectronico: data.email
            });
            // Si el registro es exitoso
            if(responseRegister.status == 201){
                // Cerrar la notificación de carga
                closeNoti();
                // Cambiar el estado de la aplicación a "registered"
                setState('registered');
                // Redirigir a la página de inicio de sesión
                navigate("/login");
            }
        }catch(error){
            // Cerrar la notificación de carga en caso de error
            closeNoti();
            console.log("Error de la solicitud: ", error.response.data.error)
            // Actualizar la notificación con el error recibido
            updateNotification({ type: 'error', message: error.response.data.error });
        }
    }

    // Función para cerrar sesión del usuario
    const logOut = () => {
        // Eliminar la información del usuario del almacenamiento local
        setUser(null);
        localStorage.removeItem("userLogged");
        // Redirigir a la página de inicio de sesión
        navigate("/login");
    };

    return (
        <AuthContext.Provider value = {{ user, loginAction, logOut, registerAction, state, setState, verifyCode }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
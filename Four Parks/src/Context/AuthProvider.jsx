import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useNotification from '../Hooks/useNotification';
import axios from 'axios';

const AuthContext = createContext();

/* eslint-disable react/prop-types */
const AuthProvider = ({ children }) => {
    const [tryCount, setTryCount] = useState(0);
    const [user, setUser] = useState(null);
    const [state, setState] = useState("");
    const navigate = useNavigate();
    const { updateNotification, closeNoti } = useNotification();

    // Comprobar si hay un usuario almacenado en el localStorage al iniciar la aplicación
    useEffect(() => {
        const userFromLocalStorage = localStorage.getItem("userLogged");
        if (userFromLocalStorage) {
            setUser(JSON.parse(userFromLocalStorage)); // Convertir la cadena JSON almacenada en el localStorage de nuevo a un objeto
        }
    }, []);

    //Función para bloquear usuario en el caso de que tenga tres intentos fallidos de inicio de sesion
    const blockAction = async (email) =>{
        try{
            updateNotification({type: 'error', message: 'Tu cuenta ha sido bloqueada, espera a que el administrador te desbloquee'})
            const response = await axios.put(`${import.meta.env.VITE_FLASK_SERVER_URL}/auth/block_usuario`, {
                correoelectronico: email
            });
            console.log(response);
            if(response.status == 200){
                closeNoti();
            }
        } catch (error) {
            console.error(error);
            updateNotification({type: 'error', message: 'Ocurrio un error en la aplicación'});
        }
    }

    //Función para bloquear usuario en el caso de que tenga tres intentos fallidos de inicio de sesion
    const unlockAction = async (email) =>{
        try{
            updateNotification({ type: 'loading', message: 'Desbloqueando...'})

            const response = await axios.put(`${import.meta.env.VITE_FLASK_SERVER_URL}/auth/unlock_usuario`, {
                correoelectronico: email
            });
            console.log(response);
            if(response.status == 200){
                closeNoti();
            }
        } catch (error) {
            console.error(error);
            updateNotification({type: 'error', message: 'Ocurrio un error en la aplicación'});
        }
    }

    // Función para realizar la acción de inicio de sesión
    const loginAction = async (data, cb) => {
        // Notificación de carga mientras se procesa la solicitud
        updateNotification({type: 'loading', message: 'Cargando...'});
        try {
            // Realizar la solicitud de inicio de sesión al servidor
            const response = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/auth/login`, {
                correoelectronico: data.email,
                contrasenia: data.password
            });
        
            console.log('Respuesta del servidor:', response);
            // Si la solicitud es exitosa
            if(response.status == 200){
                setTryCount(0);
                // Cerrar la notificación de carga
                closeNoti();
                // Llamar a la función de callback proporcionada
                cb();
                return;
            }
        } catch (error) {
            // Cerrar la notificación de carga en caso de error
            closeNoti();
            console.error("Error de la solicitud: ", error);
            if(error.response.status == 401){
                console.log(tryCount, "---");
                if(tryCount == 2) blockAction(data.email);
                setTryCount(prev => prev + 1);
            }
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
            const response = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/auth/verify`, {
                correoelectronico: email,
                codigo: code
            });
            // Si la verificación es exitosa
            if(response.status == 200){
                // Cerrar la notificación de carga
                closeNoti();
                // Establecer el usuario y almacenarlo en el almacenamiento local
                setUser({ usuario: response.data.usuario, correo: email, tipoUsuario: response.data.tipoUsuario, puntos: response.data.puntos });
                localStorage.setItem("userLogged", JSON.stringify({ usuario: response.data.usuario, correo: email, tipoUsuario: response.data.tipoUsuario, puntos: response.data.puntos }));
                // Cambiar el estado de la aplicación a "logged"
                if(response.data.primerLog) {
                    setState('first_logged');
                } else setState('logged');
                // Redirigir a la página de inicio
                navigate("/app");
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
            const responseRegister = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/auth/register`, {
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
                navigate("/crear_tarjeta", { state: { correoelectronico: data.email } });
            }
        }catch(error){
            // Cerrar la notificación de carga en caso de error
            closeNoti();
            console.log("Error de la solicitud: ", error.response.data.error)
            // Actualizar la notificación con el error recibido
            updateNotification({ type: 'error', message: error.response.data.error });
        }
    }

    // Funcion para cambiar la contraseña del usuario
    const changePassw = async (data, cb) => {
        // Notificación de carga mientras se procesa la solicitud
        updateNotification({type: 'loading', message: 'Cargando...'});
        try {
            console.log(data);
            // Realizar la solicitud de verificación al servidor
            const response = await axios.put(`${import.meta.env.VITE_FLASK_SERVER_URL}/user/cambiar_contrasenia`, {
                "correoelectronico": data.email,
                "contrasenia": data.password
            });

            console.log(response);
            // Si la verificación es exitosa
            if(response.status == 200){
                // Cerrar la notificación de carga
                closeNoti();
                cb();
                // Notificación de success mientras se procesa la solicitud
                updateNotification({type: 'success', message: 'Contraseña cambiada con exito'});
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

    // Función para cerrar sesión del usuario
    const logOut = () => {
        // Eliminar la información del usuario del almacenamiento local
        setUser(null);
        localStorage.removeItem("userLogged");
        // Redirigir a la página de inicio de sesión
        navigate("/login");
    };

    return (
        <AuthContext.Provider value = {{ user, setUser, loginAction, logOut, registerAction, state, setState, verifyCode, changePassw, unlockAction}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
import { useContext, createContext } from 'react'
import { useNavigate } from 'react-router';
import useNotification from '../Hooks/useNotification';
import axios from 'axios';

const CardContext = createContext();

/* eslint-disable react/prop-types */
const CardProvider = ({ children }) => {
    const navigate = useNavigate();
    const { updateNotification, closeNoti } = useNotification();

    const registerCard = async (data) => {
        // Notificación de carga mientras se procesa la solicitud
        updateNotification({type: 'loading', message: 'Cargando...'});

        try {
            // Realizar la solicitud de inicio de sesión al servidor
            const response = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/crear_tarjeta`, {
                correoelectronico: data.correoelectronico,
                numero_tarjeta: data.cardNumber.replace(/\s+/g, ''),
                fecha_expiracion: data.expirationDate,
                codigoseguridad: data.securityCode,
                nombrepropietario: data.cardholderName
            });
        
            console.log('Respuesta del servidor:', response);
            // Si la solicitud es exitosa
            if(response.status == 201){
                navigate('/login');
                return;
            }
        } catch (error) {
            // Cerrar la notificación de carga en caso de error
            closeNoti();
            console.error("Error de la solicitud: ", error);
            // Actualizar la notificación con el error recibido
            updateNotification({ type: 'error', message: error.response.data.error });
        }
        // Cerrar la notificación después de completar la acción
        closeNoti();
    }

    return (
        <CardContext.Provider value = {{ registerCard }}>
            {children}
        </CardContext.Provider>
    );
}

export default CardProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useCard = () => {
    return useContext(CardContext);
};
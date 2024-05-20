import axios from "axios";
import { useContext, createContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useNotification from "../Hooks/useNotification";

const ReservaContext = createContext();

/* eslint-disable react/prop-types */
const ReservaProvider = ({ children }) => {

    const navigate = useNavigate();

    const [reserva, setReserva] = useState({});
    const { updateNotification, closeNoti } = useNotification();

    const createReserva = async (data) => {
        updateNotification({type: "loading", message: "Cargando..."});
        try{
            const responseReserva = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/crear_reserva`, {
                correoelectronico: JSON.parse(localStorage.getItem('userLogged')).correo,
                idparqueadero: data.idParqueadero,
                montototal: Math.abs(data.monto),
                fechareservaentrada: data.fechaEntradaFormateada,
                fechareservasalida: data.fechaSalidaFormateada
            });
            console.log(responseReserva);

            if(responseReserva.status == 201){
                setReserva(responseReserva.data.reserva);
                navigate('/pago_tarjeta');
            }
        }catch (error){
            console.error();
        }finally{
            closeNoti();
        }
    }

    return (
        <ReservaContext.Provider value={{ createReserva, reserva }} >
            {children}
        </ReservaContext.Provider>
    );
}

export default ReservaProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useReserva = () => {
    return useContext(ReservaContext); 
}
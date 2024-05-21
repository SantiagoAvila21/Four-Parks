import axios from "axios";
import { useContext, createContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useNotification from "../Hooks/useNotification";

const ReservaContext = createContext();

/* eslint-disable react/prop-types */
const ReservaProvider = ({ children }) => {

    const navigate = useNavigate();

    const [reserva, setReserva] = useState({});
    const [parqueaderoSelected, setParqueaderoSelected] = useState({});
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

            if(responseReserva.status == 201) navigate('/pago_tarjeta');
            
        }catch (error){
            console.error();
        }finally{
            closeNoti();
        }
    }

    const pagarReserva = async (data, cb) => {
        updateNotification({type: "loading", message: "Cargando..."});
        try{
            const responseReserva = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/pago_tarjeta`, {
                correoelectronico: JSON.parse(localStorage.getItem('userLogged')).correo,
                security_code: data.security_code,
                f_expiracion: data.f_expiracion, 
                numtarjeta: data.numtarjeta.replace(/\s+/g, ''),
                nombre: data.nombre
            });

            if(responseReserva.status == 201){
                updateNotification({type: "success", message: "Pago realizado y factura enviada"});
                await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/factura`, {
                    correoelectronico: data.correoelectronico,
                    nombre_cliente: JSON.parse(localStorage.getItem('userLogged')).usuario.replace('_', ' '),
                    parqueadero: parqueaderoSelected[2],
                    tarifa: reserva.tarifa,
                    cantidadhoras: Math.abs(reserva.cantidadhoras),
                    montototal: Math.abs(reserva.monto)
                });
                cb();
            }
        }catch (error){
            console.error();
        }finally{
            closeNoti();
        }
    }

    return (
        <ReservaContext.Provider value={{ createReserva, setReserva, pagarReserva, setParqueaderoSelected }} >
            {children}
        </ReservaContext.Provider>
    );
}

export default ReservaProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useReserva = () => {
    return useContext(ReservaContext); 
}
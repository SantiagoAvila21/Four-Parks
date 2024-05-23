import axios from "axios";
import { useContext, createContext, useState } from "react";
import useNotification from "../Hooks/useNotification";
import { useAuth } from "./AuthProvider";

const ReservaContext = createContext();

/* eslint-disable react/prop-types */
const ReservaProvider = ({ children }) => {
    const { setUser } = useAuth();
    const [reserva, setReserva] = useState({});
    const [parqueaderoSelected, setParqueaderoSelected] = useState([]);
    const { updateNotification, closeNoti } = useNotification();

    const createReserva = async (data) => {
        updateNotification({type: "loading", message: "Cargando..."});
        try{
            const responseReserva = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/reserva/crear_reserva`, {
                correoelectronico: JSON.parse(localStorage.getItem('userLogged')).correo,
                idparqueadero: data.idParqueadero,
                montototal: Math.abs(data.monto),
                fechareservaentrada: data.fechaEntradaFormateada,
                fechareservasalida: data.fechaSalidaFormateada
            });
            
            setUser((prev) => {
                const updatedUser = {
                    ...prev,
                    puntos: prev.puntos + responseReserva.data.reserva.puntos
                };
                // Guardar el usuario actualizado en localStorage
                localStorage.setItem('userLogged', JSON.stringify(updatedUser));
                return updatedUser;
            });

            if(responseReserva.status == 201) updateNotification({type: "success", message: "Pago realizado y factura enviada"});
            
        }catch (error){
            console.error();
        }finally{
            closeNoti();
        }
    }

    const pagarReserva = async (data, cb) => {
        updateNotification({type: "loading", message: "Cargando..."});
        try{
            
            const responseReserva = await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/reserva/pago_tarjeta`, {
                correoelectronico: JSON.parse(localStorage.getItem('userLogged')).correo,
                security_code: data.security_code,
                f_expiracion: data.f_expiracion, 
                numtarjeta: data.numtarjeta.replace(/\s+/g, ''),
                nombre: data.nombre
            });

            if(responseReserva.status == 201){
                // Si logro el pago exitosamente se crea la reserva
                createReserva({
                    idParqueadero: reserva.parqueaderoSelected[0],
                    monto: reserva.monto,
                    fechaEntradaFormateada: reserva.fechaEntradaFormateada,
                    fechaSalidaFormateada: reserva.fechaSalidaFormateada
                });

                console.log(reserva.numfactura);

                await axios.post(`${import.meta.env.VITE_FLASK_SERVER_URL}/reserva/factura`, {
                    numfactura: reserva.numfactura,
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
        <ReservaContext.Provider value={{ setReserva, reserva, pagarReserva, setParqueaderoSelected, parqueaderoSelected }} >
            {children}
        </ReservaContext.Provider>
    );
}

export default ReservaProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useReserva = () => {
    return useContext(ReservaContext); 
}
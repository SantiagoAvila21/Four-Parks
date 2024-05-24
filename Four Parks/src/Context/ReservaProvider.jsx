import axios from "axios";
import { useContext, createContext, useState } from "react";
import useNotification from "../Hooks/useNotification";
import { useAuth } from "./AuthProvider";
import { useParking } from "./ParkingsProvider";
import generarNumeroFactura from '../utils/factura_util';

const ReservaContext = createContext();

/* eslint-disable react/prop-types */
const ReservaProvider = ({ children }) => {
    const { fetchparqueaderos } = useParking();
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

            setReserva((prev) => {
                const updatedReserva = {
                    ...prev,
                    puntos: responseReserva.data.reserva.puntos
                };
                return updatedReserva;
            });

            if(responseReserva.status == 201) updateNotification({type: "success", message: "Pago realizado y factura enviada"});
            
        }catch (error){
            console.error();
        }finally{
            closeNoti();
        }
    }

    const pagarReserva = async (data, cb) => {
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
                // Se asignan los puntos en la vista
                setUser((prev) => {
                    const updatedUser = {
                        ...prev,
                        puntos: prev.puntos + reserva.puntos
                    };
                    // Guardar el usuario actualizado en localStorage
                    localStorage.setItem('userLogged', JSON.stringify(updatedUser));
                    return updatedUser;
                });

                // Se crea la reserva en la base de datos
                createReserva({
                    idParqueadero: reserva.parqueaderoSelected[0],
                    monto: reserva.monto,
                    fechaEntradaFormateada: reserva.fechaEntradaFormateada,
                    fechaSalidaFormateada: reserva.fechaSalidaFormateada
                });

                // Si reclamo horas gratis, se le descuentan de la base de datos
                if(reserva.horasGratis > 0){
                    await axios.put(`${import.meta.env.VITE_FLASK_SERVER_URL}/user/reclamar_puntos`, {
                        correoelectronico: data.correoelectronico,
                        puntosreclamados: reserva.horasGratis * 25
                    })
                }
                
                console.log(reserva.numfactura);
                
                // Se manda la factura al correo
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
                fetchparqueaderos();
            }
        }catch (error){
            console.error();
        }finally{
            closeNoti();
        }
    }

    const cancelarReserva = async (data, cb) => {
        const userFromLocalStorage = JSON.parse(localStorage.getItem("userLogged"));
        try {
            updateNotification({ type: 'loading', message: "Cargando Cancelacion..." });
    
            const responseCancel = await axios.delete(`${import.meta.env.VITE_FLASK_SERVER_URL}/reserva/cancelar_reserva`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    numreserva: data.numreserva,
                    parqueadero: data.parqueadero,
                    correoelectronico: userFromLocalStorage.correo,
                    nombre_cliente: userFromLocalStorage.usuario.replace('_', ' '),
                    numfactura: generarNumeroFactura()
                }
            });

            console.log(responseCancel);
            
            if (responseCancel.status == 200) {
                closeNoti();
                updateNotification({ type: 'info', message: responseCancel.data.message });
                cb();
            }
        } catch (error) {
            console.error(error.response);
            closeNoti();
            updateNotification({ type: 'error', message: error.response.data.message });
        }
    }

    return (
        <ReservaContext.Provider value={{ setReserva, reserva, pagarReserva, cancelarReserva, setParqueaderoSelected, parqueaderoSelected }} >
            {children}
        </ReservaContext.Provider>
    );
}

export default ReservaProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useReserva = () => {
    return useContext(ReservaContext); 
}
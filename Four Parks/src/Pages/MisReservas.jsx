import { useState, useEffect } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/MisReservas.css";
import { ToastContainer } from "react-toastify";
import Modal from "../components/Modal";
import { CircularProgress } from "@mui/material";
import TablaReservas from "../components/TablaReservas";
import axios from 'axios'
import useNotification from "../Hooks/useNotification";
import generarNumeroFactura from '../utils/factura_util';

const MisReservas = () => {
    const [showModal, setShowModal] = useState(false);
    const [reservas, setReservas] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const { updateNotification, closeNoti } = useNotification();
    const [reservaCancelar, setReservaCancelar] = useState({
        numreserva: '',
        parqueadero: ''
    });

    const fetchReservas = async () => {
        const userFromLocalStorage = JSON.parse(localStorage.getItem("userLogged"));

        if (!userFromLocalStorage || !userFromLocalStorage.correo) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_FLASK_SERVER_URL}/reserva/buscar_reservas`, {
                params: {
                    correo_electronico: userFromLocalStorage.correo
                }
            });

            if (response.status === 200) {
                setReservas(response.data);
            }
        } catch (error) {
            console.error(error);
            updateNotification({type: 'error', message: 'Ocurrió un error en la aplicación.'})
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const cancelarReserva = async () => {
        const userFromLocalStorage = JSON.parse(localStorage.getItem("userLogged"));
        try {
            updateNotification({ type: 'loading', message: "Cargando Cancelacion..." });
    
            const responseCancel = await axios.delete(`${import.meta.env.VITE_FLASK_SERVER_URL}/reserva/cancelar_reserva`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    numreserva: reservaCancelar.numreserva,
                    parqueadero: reservaCancelar.parqueadero,
                    correoelectronico: userFromLocalStorage.correo,
                    nombre_cliente: userFromLocalStorage.usuario.replace('_', ' '),
                    numfactura: generarNumeroFactura()
                }
            });
            
            if (responseCancel.status == 200) {
                closeNoti();
                updateNotification({ type: 'info', message: responseCancel.data.message });
                fetchReservas();
            }
        } catch (error) {
            console.error(error.response.data);
            closeNoti();
            updateNotification({ type: 'error', message: error.response.data.message });
        }
    }
    

    const handleCancel = () => {
        cancelarReserva();
        setShowModal(prev => !prev);
    }

    return (
        <div className="MisReservas">
            <Modal shouldShow={showModal} close onRequestClose={() => {
                    setShowModal((prev) => !prev);
            }}>
                <div className="twoFactor">
                    <p>¿Está seguro que desea cancelar la reserva?</p>
                    <strong><p style={{color: "red", textAlign: "center"}}>Recuerda que si cancelas una reserva con 30 minutos de anticipacion se te cobrará una multa, y la factura te llegara a tu correo</p></strong>
                    <button id="submitButton" type="submit" onClick={handleCancel}>CANCELAR RESERVA</button>
                </div>
            </Modal>
            <SideLogo />
            <div className="misReservas Page">
                <h1 style={{marginBottom: "20px"}}> MIS RESERVAS </h1>
                <div className="infoUsuarios">
                    {isLoading && 
                        <div id="loadingDiv">
                            <CircularProgress />
                        </div>
                    }
                    {!isLoading && reservas.length === 0 && <h1>TODAVIA NO HAS REALIZADO NINGUNA RESERVA</h1>}
                    {!isLoading && reservas.length > 0 && 
                        <div className="tablaUsuarios" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <TablaReservas reservas={reservas} cb={(numreserva, parqueadero) => {
                                setReservaCancelar({ numreserva, parqueadero })
                                setShowModal(prev => !prev)}
                            }/>
                        </div>
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default MisReservas;

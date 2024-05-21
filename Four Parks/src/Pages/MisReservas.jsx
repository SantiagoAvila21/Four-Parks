import { useState, useEffect } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/MisReservas.css";
import { ToastContainer } from "react-toastify";
import Modal from "../components/Modal";
import { CircularProgress } from "@mui/material";
import TablaReservas from "../components/TablaReservas";
import axios from 'axios'
import useNotification from "../Hooks/useNotification";

const MisReservas = () => {
    const [showModal, setShowModal] = useState(false);
    const [reservas, setReservas] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const { updateNotification } = useNotification();

    useEffect(() => {
        const fetchReservas = async () => {
            const userFromLocalStorage = JSON.parse(localStorage.getItem("userLogged"));

            if (!userFromLocalStorage || !userFromLocalStorage.correo) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_FLASK_SERVER_URL}/buscar_reservas`, {
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

        fetchReservas();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCancel = () => {
        console.log("Confirmada la cancelacion");
        console.log(reservas);
    }

    return (
        <div className="MisReservas">
            <Modal shouldShow={showModal} close onRequestClose={() => {
                    setShowModal((prev) => !prev);
            }}>
                <div className="twoFactor">
                    <p>¿Está seguro que desea cancelar la reserva?</p>
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
                        <div className="tablaUsuarios">
                            <TablaReservas reservas={reservas} cb={() => setShowModal(prev => !prev)}/>
                        </div>
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default MisReservas;

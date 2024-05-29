import { useEffect, useState } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/Usuarios.css";
import { ToastContainer } from "react-toastify";
import axios from 'axios'
import { CircularProgress } from "@mui/material";
import TablaUsuarios from "../components/TablaUsuarios";
import Modal from "../components/Modal";
import { useParking } from "../Context/ParkingsProvider";
import useNotification from "../Hooks/useNotification";

const Usuarios = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setshowModal] = useState(false);
    const [selectedParqueadero, setSelectedParqueadero] = useState('');
    const [selectedCorreo, setSelectedCorreo] = useState('');
    const [selectedRol, setSelectedRol] = useState();
    const { updateNotification, closeNoti } = useNotification();

    const { parqueaderos } = useParking();

    // Traer a todos los usuarios
    const fetchUsuarios = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_FLASK_SERVER_URL}/user/get_usuarios/`);
            if(response.status == 200){
                setUsuarios(response.data);
                setIsLoading(false);
                return;
            }
            console.log(usuarios);
          } catch (error) {
            console.error("Error de la solicitud: ", error.response.data.error)
        }
    }

    useEffect(() => {
        fetchUsuarios();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const assignDB = async (idtipo, correo) => {
        try{
            updateNotification({type: 'loading', message: "Cargando..."})

            const responseAssign = await axios.put(`${import.meta.env.VITE_FLASK_SERVER_URL}/user/cambiar_tipousuario`, {
                correoelectronico: correo,
                tipousuario: idtipo,
                idparqueadero: selectedParqueadero
            });
            
            // Asignacion completada satisfactoriamente
            if(responseAssign.status == 200){
                closeNoti();
                updateNotification({type: 'info', message: responseAssign.data.message});
                fetchUsuarios();
            }
        }catch(error){
            console.error(error.response.data);
            closeNoti();
            updateNotification({type: 'error', message: error.response.data.message});
        }
    }

    // Boton de asignacion de Parqueadero a nuevo Administrador de punto
    const handleAssign = (event) => {
        event.preventDefault();
        if(selectedParqueadero === ""){
            updateNotification({type: 'error', message: 'Porfavor seleccione un parqueadero'});
            return;
        }
        // Asignacion en la base de datos
        assignDB(selectedRol, selectedCorreo);
        setshowModal((prev) => !prev);
    }

    const handleParqueaderoChange = (event) => setSelectedParqueadero(event.target.value);

    return (
        <div className="Usuarios">
            <Modal shouldShow={showModal} close onRequestClose={() => {
                    setshowModal((prev) => !prev);
            }}>
                <div className="twoFactor">
                    <p>Seleccione el parqueadero que desea designar como Administrador de punto.</p>
                    <select className="inputParqueadero" id="parqueadero" value={selectedParqueadero} onChange={handleParqueaderoChange}>
                        <option value="">Selecciona un parqueadero</option>
                        {parqueaderos.map((parqueadero, index) => (
                            <option key={index} value={parqueadero[0]}>
                                {parqueadero[2]}
                            </option>
                        ))}
                    </select>
                    <button id="submitButton" type="submit" onClick={handleAssign}>ASIGNAR PARQUEADERO</button>
                </div>
            </Modal>
            <SideLogo />
            <div className="usuarios Page">
                <h2> USUARIOS </h2>
                <div className="infoUsuarios">
                    {isLoading && 
                        <div id="loadingDiv">
                            <CircularProgress />
                        </div>
                    }
                    {!isLoading && 
                        <div className="tablaUsuarios" style={{ maxHeight: '80%', overflowY: 'auto' }}>
                            <TablaUsuarios users={usuarios} fetchUsers = {fetchUsuarios} cb = {(email, idtipousuario) => {
                                setSelectedRol(idtipousuario);
                                setSelectedCorreo(email);
                                if(idtipousuario == 3) assignDB(idtipousuario, email);
                                else setshowModal((prev) => !prev);
                            }} />
                        </div>
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Usuarios;
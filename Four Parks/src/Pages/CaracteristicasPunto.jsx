import SideLogo from "../components/SideLogo";
import { useState, useRef, useEffect } from "react";
import "../styles/Reserva.css";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import { useParking } from "../Context/ParkingsProvider";
import { FaDollarSign, FaCar, FaMotorcycle, FaBicycle } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const CaracteristicasPunto = () => {
    const { updateNotification, closeNoti } = useNotification();
    const [selectedParqueadero, setSelectedParqueadero] = useState('');
    const [parqueaderoAdmin, setParqueaderoAdmin] = useState({});
    const [caracteristicaCambiar, setCaracteristicaCambiar] = useState('');
    const [valorTarifa, setValorTarifa] = useState('');
    const [loading, setLoading] = useState(true);
    const tipoVehiculoRef = useRef(null);
    const { parqueaderos } = useParking();

    const handleParqueaderoChange = (event) => setSelectedParqueadero(event.target.value);
    const handleCaracteristicaChange = (event) => setCaracteristicaCambiar(event.target.value);
    const handleTarifaChange = (event) => setValorTarifa(event.target.value);

    const asignarTarifa = async () => {
        try {
            updateNotification({type: "loading", message: "Cargando..."});
            let tarifa = '';
            if(caracteristicaCambiar == "Multas") tarifa = 'tarifamulta';
            else{
                if(tipoVehiculoRef.current.value == '1') tarifa = "tarifacarro";
                if(tipoVehiculoRef.current.value == '2') tarifa = "tarifamoto";
                if(tipoVehiculoRef.current.value == '3') tarifa = "tarifabici";
            }

            console.log({
                tarifa,
                valor: valorTarifa,
                idparqueadero: selectedParqueadero
            });

            const responseTarifa = await axios.put(`${import.meta.env.VITE_FLASK_SERVER_URL}/parqueadero/cambiar_tarifa_parqueadero`, {
                tarifa,
                valor: valorTarifa,
                idparqueadero: selectedParqueadero
            })
            
            if (responseTarifa.status === 200) {
                updateNotification({type: "info", message: responseTarifa.data.message});
            }
        } catch (error) {
            console.error(error);
            updateNotification({type: 'error', message: 'Ocurrió un error en la aplicación.'})
        } finally {
            closeNoti();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedParqueadero || !caracteristicaCambiar || (caracteristicaCambiar === 'Tarifas' && !tipoVehiculoRef.current.value) || !valorTarifa) {
            updateNotification({ type: 'error', message: 'Todos los campos son obligatorios' });
            return;
        }
        if(!(valorTarifa > 1000 )){
            updateNotification({ type: 'error', message: 'Ingresa valores mayores a $1000 COP' });
            return;
        }

        asignarTarifa();
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userLogged"));
        const tipoUsuario = user.tipoUsuario;
        const fetchParqueaderoManejado = async () => {
            try{
                const responsePAdmin = await axios.get(`${import.meta.env.VITE_FLASK_SERVER_URL}/parqueadero//get_parqueadero_administrador/${user.correo}`);
                console.log(responsePAdmin)
                if(responsePAdmin.status == 200){
                    setParqueaderoAdmin(responsePAdmin.data);
                    setSelectedParqueadero(responsePAdmin.data.idparqueadero);
                    setLoading(false);
                } 
            }catch (error){
                console.error(error);
            }
        }
        if(tipoUsuario == 'Administrador de Punto'){
            fetchParqueaderoManejado();

        }
    },[]);

    return (
        <div className="Reserva">
            <SideLogo />
            <div className="reserva Page">
                <h1 style={{marginBottom: "50px"}}>CARACTERISTICAS DE PUNTO</h1>
                <div className="reserva FormReserva">
                    <form>
                        <div className="reserva info">
                            <label>PARQUEADERO</label>
                            {JSON.parse(localStorage.getItem("userLogged")).tipoUsuario == 'Administrador General' && 
                                <select className="inputParqueadero" id="parqueadero" value={selectedParqueadero} onChange={handleParqueaderoChange}>
                                    <option value="">Selecciona un parqueadero</option>
                                    {parqueaderos.map((parqueadero, index) => (
                                        <option key={index} value={parqueadero[0]}>
                                            {parqueadero[2]}
                                        </option>
                                    ))}
                                </select>
                            }
                            {JSON.parse(localStorage.getItem("userLogged")).tipoUsuario == 'Administrador de Punto' && 
                                <>
                                    {loading && <CircularProgress />}
                                    {!loading && (
                                        <input 
                                            type="text" 
                                            name="parqueadero"
                                            value={parqueaderoAdmin.nombreparqueadero}
                                            className="inputForm"
                                            disabled 
                                        />
                                    )}
                                </>
                            }
                        </div>
                        <div className="reserva info">
                            <label>CARACTERÍSTICA A CAMBIAR</label>
                            <select name="caracteristica" onChange={handleCaracteristicaChange} className="inputForm">
                                <option value={""}>Elegir</option>
                                <option value={"Tarifas"}>Tarifas</option>
                                <option value={"Multas"}>Multas</option>
                            </select>
                        </div>
                        {caracteristicaCambiar == 'Tarifas' && (
                            <div className="reserva info">
                                <label>TIPO VEHICULO</label>
                                <select name="tipoVehiculo" className="inputForm" ref={tipoVehiculoRef}>
                                    <option value={""}>Seleccione un tipo de vehiculo</option>
                                    <option value={"1"}> <><FaCar /> Carro</> </option>
                                    <option value={"2"}> <><FaMotorcycle /> Moto</></option>
                                    <option value={"3"}> <><FaBicycle /> Bicicleta</></option>
                                </select>
                            </div>
                        )}
                        {(caracteristicaCambiar == 'Tarifas' || caracteristicaCambiar == 'Multas') && (
                            <div className="reserva info" id="tarifa" style={{ position: 'relative' }}>
                            <label>{caracteristicaCambiar == 'Tarifas' ? 'VALOR A INGRESAR' : 'VALOR DE LA MULTA'}</label>
                            <input 
                                type="number" 
                                name="placa"
                                value={valorTarifa}
                                minLength = { 4 }
                                placeholder= "Valor en COP"
                                onChange={handleTarifaChange} 
                                className="inputForm"
                                style={{ paddingLeft: '25px', width: "90%" }}
                            />
                            <FaDollarSign style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />
                        </div>
                        )}
                    </form>
                </div>
                <button id="submitButton" type="submit" onClick={handleSubmit}> GUARDAR </button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default CaracteristicasPunto;

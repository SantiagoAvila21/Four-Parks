import SideLogo from "../components/SideLogo";
import { useState, useRef } from "react";
import "../styles/Reserva.css";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import { useParking } from "../Context/ParkingsProvider";
import { FaDollarSign } from "react-icons/fa";


const CaracteristicasPunto = () => {
    const { updateNotification } = useNotification();
    const [selectedParqueadero, setSelectedParqueadero] = useState('');
    const [caracteristicaCambiar, setCaracteristicaCambiar] = useState('');
    const [valorTarifa, setValorTarifa] = useState('');
    const tipoVehiculoRef = useRef(null);
    const { parqueaderos } = useParking();

    const handleParqueaderoChange = (event) => setSelectedParqueadero(event.target.value);
    const handleCaracteristicaChange = (event) => setCaracteristicaCambiar(event.target.value);
    const handleTarifaChange = (event) => setValorTarifa(event.target.value);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedParqueadero || !caracteristicaCambiar || (caracteristicaCambiar === 'Tarifas' && !tipoVehiculoRef.current.value) || !valorTarifa) {
            updateNotification({ type: 'error', message: 'Todos los campos son obligatorios' });
            return;
        }
    }

    return (
        <div className="Reserva">
            <SideLogo />
            <div className="reserva Page">
                <h1 style={{marginBottom: "50px"}}>CARACTERISTICAS DE PUNTO</h1>
                <div className="reserva FormReserva">
                    <form>
                        <div className="reserva info">
                            <label>PARQUEADERO</label>
                            <select className="inputParqueadero" id="parqueadero" value={selectedParqueadero} onChange={handleParqueaderoChange}>
                                <option value="">Selecciona un parqueadero</option>
                                {parqueaderos.map((parqueadero, index) => (
                                    <option key={index} value={parqueadero[0]}>
                                        {parqueadero[2]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="reserva info">
                            <label>CARACTERÍSTICA A CAMBIAR</label>
                            <select name="tipoVehiculo" onChange={handleCaracteristicaChange} className="inputForm">
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
                                    <option value={"1"}>Carro</option>
                                    <option value={"2"}>Moto</option>
                                    <option value={"3"}>Bicicleta</option>
                                </select>
                            </div>
                        )}
                        {(caracteristicaCambiar == 'Tarifas' || caracteristicaCambiar == 'Multas') && (
                            <div className="reserva info" id="tarifa" style={{ position: 'relative' }}>
                            <label>{caracteristicaCambiar == 'Tarifas' ? 'VALOR A INGRESAR' : 'VALOR DE LA MULTA'}</label>
                            <input 
                                type="text" 
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

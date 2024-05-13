import SideLogo from "../components/SideLogo";
import { useState } from "react";
import "../styles/Reserva.css";
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useLocation } from 'react-router-dom';
import dayjs from "dayjs";
import useNotification from "../Hooks/useNotification";

const Reserva = () => {
    const location = useLocation();
    const [fecha, setFecha] = useState(dayjs());
    const { updateNotification } = useNotification();

    const [infoReserva, setInfoReserva] = useState({
        parqueadero: location.state.nombreParqueadero,
        tipoVehiculo: '',
        placa: '',
    });

    const handleChangeForm = (event) => {
        const { name, value } = event.target;
        setInfoReserva(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFecha(date);
    };

    const handleChangePlaca = (event) => {
        let nuevaPlaca = event.target.value.toUpperCase(); // Convertir todo a mayúsculas
        nuevaPlaca = nuevaPlaca.replace(/[^A-Z\d]/g, ''); // Eliminar caracteres no permitidos
        if (nuevaPlaca.length > 3) {
          // Insertar guion después de las primeras tres letras
          nuevaPlaca = nuevaPlaca.slice(0, 3) + '-' + nuevaPlaca.slice(3);
        }
        setInfoReserva(prevState => ({
            ...prevState,
            placa: nuevaPlaca
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const fechaFormateada = dayjs(fecha).format('YYYY-MM-DD HH:mm:ss');

        
        console.log(infoReserva);
        console.log(fechaFormateada);
        if(Object.values(infoReserva).includes('')){
            updateNotification({ type: 'error', message: 'Hay al menos un espacio en blanco' });
            return;
        }
        
        // Revisar El Regex del correo Electronico
        const placaRegex = /^[A-Z]{3}-?\d{3}$/;
        
        if(!placaRegex.test(infoReserva.placa)){
            updateNotification({ type: 'error', message: 'Porfavor ingrese una placa válida' });
            return;
        }

        updateNotification({ type: 'success', message: 'Se realiza la reserva con éxito'});
    }

    return (
        <div className="Reserva">
            <SideLogo />
            <div className="reserva Page">
                <h1>RESERVA</h1>
                <div className="reserva FormReserva">
                    <form>
                        <div className="reserva info">
                            <label>PARQUEADERO</label>
                            <input 
                                type="text" 
                                name="parqueadero"
                                defaultValue={location.state.nombreParqueadero}
                                onChange={handleChangeForm} 
                                className="inputForm"
                                disabled 
                            />
                        </div>
                        <div className="reserva info">
                            <label>TIPO VEHICULO</label>
                            <select name="tipoVehiculo" onChange={handleChangeForm} className="inputForm">
                                <option value={""}>Seleccione un tipo de documento</option>
                                <option value={"1"}>Carro</option>
                                <option value={"2"}>Moto</option>
                                <option value={"3"}>Bicicleta</option>
                            </select>
                        </div>
                        <div className="reserva info">
                            <label>PLACA</label>
                            <input 
                                type="text" 
                                name="placa"
                                value={infoReserva.placa}
                                maxLength={7}
                                placeholder="ABC-123"
                                onChange={handleChangePlaca} 
                                className="inputForm"
                            />
                        </div>
                        <div className="reserva info">
                            <label>FECHA</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    value={fecha}
                                    name="fecha"
                                    onChange={handleDateChange}
                                />
                            </LocalizationProvider>
                        </div>
                    </form>
                </div>
                <button id="submitButton" type="submit" onClick={handleSubmit}>RESERVAR</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Reserva;
import SideLogo from "../components/SideLogo";
import { useState, useEffect } from "react";
import "../styles/Reserva.css";
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import useNotification from "../Hooks/useNotification";
import { useParking } from "../Context/ParkingsProvider";
import { useReserva } from "../Context/ReservaProvider";

const Reserva = () => {
    const location = useLocation();
    const [fechaEntrada, setFechaEntrada] = useState(dayjs());
    const [fechaSalida, setFechaSalida] = useState(dayjs());
    const { updateNotification } = useNotification();
    const parking = useParking();
    const navigate = useNavigate();
    const { setReserva, setParqueaderoSelected, parqueaderoSelected } = useReserva();

    const [tarifas, setTarifas] = useState({
        'tarifacarro': '',
        'tarifamoto': '',
        'tarifabici': ''
    });
    
    useEffect(() => {
        const infoParqueadero = parking.parqueaderos.filter(parqueadero => parqueadero[2] === location.state.nombreParqueadero)[0];
        if(infoParqueadero){
            setParqueaderoSelected(infoParqueadero);
            setTarifas({
                'tarifacarro': infoParqueadero[9],
                'tarifamoto': infoParqueadero[10],
                'tarifabici': infoParqueadero[11]
            });
        }
    }, [parking.parqueaderos, location.state.nombreParqueadero]);

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

    const handleDateChange = (date, isEntrada) => {
        if (isValidDate(date, isEntrada)) {
            if(isEntrada) setFechaEntrada(date);
            else setFechaSalida(date);
        } else {
            updateNotification({ type: 'error', message: 'La fecha seleccionada no es válida.' });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // MANEJO DE ERRORES EN LAS FECHAS INGRESADAS ------
        if (!fechaEntrada.isValid() || fechaEntrada.minute() !== 0) {
            updateNotification({ type: 'error', message: 'Por favor, seleccione una hora fija para la fecha de entrada.' });
            return;
        }

        if (!fechaSalida.isValid() || fechaSalida.minute() !== 0) {
            updateNotification({ type: 'error', message: 'Por favor, seleccione una hora fija para la fecha de salida.' });
            return;
        }

        if(fechaSalida.isBefore(fechaEntrada, 'hour')){
            updateNotification({ type: 'error', message: 'Por favor, seleccione una hora de salida posterior a la de entrada.' });
            return;
        }

        const fechaEntradaFormateada = dayjs(fechaEntrada).format('YYYY-MM-DD HH:mm:ss');
        const fechaSalidaFormateada = dayjs(fechaSalida).format('YYYY-MM-DD HH:mm:ss');

        if(Object.values(infoReserva).includes('')){
            updateNotification({ type: 'error', message: 'Hay al menos un espacio en blanco' });
            return;
        }

        // MANEJO DE ERRORES DE PLACAS INGRESADAS -----
        const placaRegexCarro = /^[A-Z]{3}-?\d{3}$/;
        const placaRegexMoto = /^[A-Z]{3}-?\d{2}[A-Z]$/;

        let placaRegex;
        if (infoReserva.tipoVehiculo === '1') placaRegex = placaRegexCarro;
        else if (infoReserva.tipoVehiculo === '2') placaRegex = placaRegexMoto;
        else placaRegex = null;

        if (placaRegex && !placaRegex.test(infoReserva.placa)) {
            updateNotification({ type: 'error', message: 'Por favor, ingrese una placa válida para el tipo de vehiculo.' });
            return;
        }

        // MANEJO DE ERRORES GENERAL -----
        if(Object.values(infoReserva).includes('')){
            updateNotification({ type: 'error', message: 'Hay al menos un espacio en blanco' });
            return;
        }

        let tarifa = 0;
        let tipoV = "";
        if(infoReserva.tipoVehiculo === '1'){
            tarifa = tarifas.tarifacarro;
            tipoV = "CARRO";  
        } else if(infoReserva.tipoVehiculo === '2'){
            tarifa = tarifas.tarifamoto;
            tipoV = "MOTO";
        } else if(infoReserva.tipoVehiculo === '3'){
            tarifa = tarifas.tarifabici;
            tipoV = "BICI";
        } 

        let cantidadhoras = fechaEntrada.diff(fechaSalida, 'hour');

        const generarNumeroFactura = () => {
            const letras = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
            const numeros = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
            return letras + numeros;
        }

        setReserva({
            parqueaderoSelected,
            monto: Math.abs(tarifa * cantidadhoras),
            fechaEntradaFormateada,
            fechaSalidaFormateada,
            cantidadhoras,
            tarifa,
            placa: infoReserva.placa,
            tipoVehiculo: tipoV,
            numfactura: generarNumeroFactura(),
        });

        navigate("/pago_tarjeta");
    }

    // Función para manejar el cambio de placa según el tipo de vehículo
    const handleChangePlaca = (event) => {
        const { value } = event.target;
        let nuevaPlaca = value.toUpperCase();
        
        if (infoReserva.tipoVehiculo === '1' || infoReserva.tipoVehiculo === '2') {
            nuevaPlaca = nuevaPlaca.replace(/[^A-Z\d]/g, '');
            if (nuevaPlaca.length > 3) {
                nuevaPlaca = nuevaPlaca.slice(0, 3) + '-' + nuevaPlaca.slice(3);
            }
        } else if (infoReserva.tipoVehiculo === '3') {
            nuevaPlaca = nuevaPlaca.replace(/[^A-Z\d]/g, ''); 
            nuevaPlaca = nuevaPlaca.slice(0, 12); 
        }
    
        setInfoReserva(prevState => ({
            ...prevState,
            placa: nuevaPlaca
        }));
    };

    // Función para determinar el placeholder según el tipo de vehículo
    const getPlacaPlaceholder = () => {
        if (infoReserva.tipoVehiculo === '2') { // Si es moto
            return "ABC-12D";
        } else if (infoReserva.tipoVehiculo === '3') { // Si es bicicleta
            return "Ingrese el marco de su bicicleta";
        } else { // Si es carro
            return "ABC-123";
        }
    };

    // Función que valida los datos de la fecha
    const isValidDate = (date) => {
        const today = dayjs().startOf('day');
        const eightDaysLater = today.add(8, 'days');
        return date.isBetween(today, eightDaysLater, null, '[]');
    };

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
                                <option value={""}>Seleccione un tipo de vehiculo</option>
                                <option value={"1"}>Carro</option>
                                <option value={"2"}>Moto</option>
                                <option value={"3"}>Bicicleta</option>
                            </select>
                            {infoReserva.tipoVehiculo === '1' && <p> <strong> Tarifa: </strong> $ {tarifas.tarifacarro} COP / hora</p>}
                            {infoReserva.tipoVehiculo === '2' && <p> <strong> Tarifa: </strong> $ {tarifas.tarifamoto} COP / hora</p>}
                            {infoReserva.tipoVehiculo === '3' && <p> <strong> Tarifa: </strong> $ {tarifas.tarifabici} COP / hora</p>}
                        </div>
                        {infoReserva.tipoVehiculo && 
                            <div className="reserva info" id="placa">
                                <label>{infoReserva.tipoVehiculo === '3' ? 'Marco' : 'PLACA'}</label>
                                <input 
                                    type="text" 
                                    name="placa"
                                    value={infoReserva.placa}
                                    maxLength={infoReserva.tipoVehiculo === '2' || infoReserva.tipoVehiculo === '1' ? 7 : 12}
                                    placeholder={getPlacaPlaceholder()}
                                    onChange={handleChangePlaca} 
                                    className="inputForm"
                                />
                            </div>
                        }
                        <div className="reserva info fechaEntrada">
                            <label>FECHA ENTRADA</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    value={fechaEntrada}
                                    name="fecha"
                                    onChange={date => handleDateChange(date, true)}
                                    disablePast={true} // No permitir fechas anteriores al día de hoy
                                    shouldDisableDate={date => !isValidDate(date)} // Deshabilitar fechas mayores a 8 días
                                    disableTimeValidation={true} // Deshabilitar validación de hora
                                    minutesStep={60}
                                    allowSameDateSelection={true} // Permitir selección de la misma fecha
                                />  
                            </LocalizationProvider>
                        </div>
                        <div className="reserva info">
                            <label>FECHA SALIDA</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    value={fechaSalida}
                                    name="fecha"
                                    onChange={date => handleDateChange(date, false)}
                                    disablePast={true} // No permitir fechas anteriores al día de hoy
                                    shouldDisableDate={date => !isValidDate(date)} // Deshabilitar fechas mayores a 8 días
                                    disableTimeValidation={true} // Deshabilitar validación de hora
                                    minutesStep={60}
                                    allowSameDateSelection={true} // Permitir selección de la misma fecha
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

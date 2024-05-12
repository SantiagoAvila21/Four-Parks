import SideLogo from "../SideLogo";
import "../styles/Reserva.css";
import { ToastContainer } from "react-toastify";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useLocation } from 'react-router-dom';

const Reserva = () => {
    const location = useLocation();

    const handleChangeForm = () => {
        console.log("ChangeForm");
    }

    const handleSubmit = () => {
        console.log("Submit");
    }

    return (
        <div className="Reserva">
            <SideLogo />
            <div className="reserva Page">
                <h1>RESERVA</h1>
                <div className="reserva Form">
                    <form>
                        <div className="reserva info">
                            <label>PARQUEADERO</label>
                            <input 
                                type="text" 
                                name="nombre"
                                defaultValue={location.state.nombreParqueadero}
                                onChange={handleChangeForm} 
                                className="inputForm"
                                disabled 
                            />
                        </div>
                        <div className="reserva info">
                            <label>TIPO VEHICULO</label>
                            <select name="tipoDoc" onChange={handleChangeForm} className="inputForm">
                                <option value={""}>Seleccione un tipo de documento</option>
                                <option value={"CC"}>Carro</option>
                                <option value={"TI"}>Moto</option>
                                <option value={"TE"}>Bicicleta</option>
                            </select>
                        </div>
                        <div className="reserva info">
                            <label>PLACA</label>
                            <input 
                                type="text" 
                                name="numDoc"
                                value={''}
                                onChange={handleChangeForm} 
                                className="inputForm"
                            />
                        </div>
                        <div className="reserva info">
                            <label>FECHA</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    defaultValue={dayjs('2022-04-17T15:30')}
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
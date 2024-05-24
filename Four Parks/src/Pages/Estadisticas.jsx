import SideLogo from "../components/SideLogo";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useState, useEffect } from "react";
import "../styles/Estadisticas.css";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormLabel from '@mui/material/FormLabel';
import { ToastContainer } from "react-toastify";
import { useParking } from "../Context/ParkingsProvider";
import { CircularProgress } from "@mui/material";
import axios from "axios";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Reservas por Mes',
        },
    },
};
  
const data = [
    { month: 'January', reservas: 120 },
    { month: 'February', reservas: 150 },
    { month: 'March', reservas: 180 },
    { month: 'April', reservas: 170 },
    { month: 'May', reservas: 200 },
    { month: 'June', reservas: 220 },
    { month: 'July', reservas: 250 }
];

const labels = data.map(item => item.month);
const reservas = data.map(item => item.reservas);

const chartData = {
    labels,
    datasets: [
        {
            label: 'Reservas',
            data: reservas,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

const Estadisticas = () => {
    const [timeStat, setTimeStat] = useState('hoy');
    const [selectedParqueadero, setSelectedParqueadero] = useState('');
    const [parqueaderoAdmin, setParqueaderoAdmin] = useState({ nombreparqueadero: '' });
    const [loading, setLoading] = useState(true);

    const [statBar, setStatBar] = useState('');
    const [statLine, setStatLine] = useState('');
    const [statPie, setStatPie] = useState('');

    const { parqueaderos } = useParking();

    const handlestatBarChange = (event) => setStatBar(event.target.value);
    const handlestatLineChange = (event) => setStatLine(event.target.value);
    const handlestatPieChange = (event) => setStatPie(event.target.value);

    const handleTimeStatChange = (event) => setTimeStat(event.target.value);
    const handleParqueaderoChange = (event) => setSelectedParqueadero(event.target.value);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userLogged"));
        const tipoUsuario = user.tipoUsuario;
        const fetchParqueaderoManejado = async () => {
            try {
                const responsePAdmin = await axios.get(`${import.meta.env.VITE_FLASK_SERVER_URL}/parqueadero/get_parqueadero_administrador/${user.correo}`);
                if (responsePAdmin.status === 200) {
                    setParqueaderoAdmin(responsePAdmin.data);
                    setSelectedParqueadero(responsePAdmin.data.idparqueadero);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (tipoUsuario === 'Administrador de Punto') {
            fetchParqueaderoManejado();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div className="Estadisticas">
            <SideLogo />
            <div className="estadistica Page">
                <h1 style={{ marginBottom: "10px" }}>ESTADISTICAS</h1>
                <div className="estadistica FormReservaStat">
                    <div className="tiempoExportar">
                        <div className="tiempoStat">
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Estadistica de: </FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={timeStat}
                                    onChange={handleTimeStatChange}
                                >
                                    <FormControlLabel value="hoy" control={<Radio />} label="Hoy" />
                                    <FormControlLabel value="ayer" control={<Radio />} label="Ayer" />
                                    <FormControlLabel value="1m" control={<Radio />} label="1M" />
                                    <FormControlLabel value="3m" control={<Radio />} label="3M" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <h2 id="exportarButton">Exportar</h2>
                    </div>
                    <div className="parqueadero">
                        <label>PARQUEADERO</label>
                        {JSON.parse(localStorage.getItem("userLogged")).tipoUsuario === 'Administrador General' &&
                            <select className="inputParqueadero" id="parqueadero" value={selectedParqueadero} onChange={handleParqueaderoChange}>
                                <option value="">Selecciona un parqueadero</option>
                                {parqueaderos.map((parqueadero, index) => (
                                    <option key={index} value={parqueadero[0]}>
                                        {parqueadero[2]}
                                    </option>
                                ))}
                            </select>
                        }
                        {JSON.parse(localStorage.getItem("userLogged")).tipoUsuario === 'Administrador de Punto' &&
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
                    <div className="scrollable-container">
                        <div className="graficaEstadistica">
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                                    <InputLabel id="demo-simple-select-standard-label">Variable</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={statBar}
                                        onChange={handlestatBarChange}
                                        label="Age"
                                    >
                                        <MenuItem value={""}>Variable</MenuItem>
                                        <MenuItem value={1}>Cantidad de reservas hechas</MenuItem>
                                    </Select>
                                </FormControl>
                            <div className="chart-container">
                                {!statBar && <h2>Selecciona la variable a graficar</h2>}
                                {statBar && <Bar options={options} data={chartData} />}
                            </div>
                        </div>
                        <div className="graficaEstadistica">
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                                    <InputLabel id="demo-simple-select-standard-label">Variable</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={statLine}
                                        onChange={handlestatLineChange}
                                        label="Age"
                                    >
                                        <MenuItem value={""}>Variable</MenuItem>
                                        <MenuItem value={1}>Duracion de las reservas</MenuItem>
                                    </Select>
                                </FormControl>
                                <div className="chart-container">
                                {!statLine && <h2>Selecciona la variable a graficar</h2>}
                                {statLine && <Bar options={options} data={chartData} />}
                            </div>
                        </div>
                        <div className="graficaEstadistica">
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                                    <InputLabel id="demo-simple-select-standard-label">Variable</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={statPie}
                                        onChange={handlestatPieChange}
                                        label="Age"
                                    >
                                        <MenuItem value={""}>Variable</MenuItem>
                                        <MenuItem value={1}>Proporcion de reservas por duracion</MenuItem>
                                    </Select>
                                </FormControl>
                                <div className="chart-container">
                                {!statPie && <h2>Selecciona la variable a graficar</h2>}
                                {statPie && <Bar options={options} data={chartData} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Estadisticas;

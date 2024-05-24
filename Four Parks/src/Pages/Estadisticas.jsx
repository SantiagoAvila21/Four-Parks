import SideLogo from "../components/SideLogo";
import 'chart.js/auto';
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
import useReservasData from "../Hooks/useReservasData";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";


const Estadisticas = () => {
    const [timeStat, setTimeStat] = useState('hoy');
    const [selectedParqueadero, setSelectedParqueadero] = useState('');
    const [parqueaderoAdmin, setParqueaderoAdmin] = useState({ nombreparqueadero: '' });
    const [loading, setLoading] = useState(true);
    const { fetchChartData } = useReservasData(selectedParqueadero);
    
    // Estados que mantienen la informacion de las graficas
    const [barData, setBarData] = useState();
    const [lineData, setLineData] = useState();
    const [pieData, setPieData] = useState();

    // Estados que mantienen cual es la estadistica a mostrar
    const [statBar, setStatBar] = useState('');
    const [statLine, setStatLine] = useState('');
    const [statPie, setStatPie] = useState('');

    const { parqueaderos } = useParking();


    // Funciones manejadoras de la grafica de Barras
    const handleStatBarChange = (event) => {
        setStatBar(event.target.value);
        graficarBarras(event.target.value);
    }
    const graficarBarras = async (stat = statBar, time = timeStat, parqueadero = selectedParqueadero) => {
        if (parqueadero && stat) {
            const chartData = await fetchChartData(time);
            if(!chartData) setStatBar('');
            setBarData(chartData);
        }
    };

    // Funciones manejadoras de la grafica de Lineas
    const handleStatLineChange = (event) => {
        setStatLine(event.target.value);
        graficarLineas(event.target.value);
    }
    const graficarLineas = async (stat = statLine, time = timeStat, parqueadero = selectedParqueadero) => {
        if (parqueadero && stat) {
            const chartData = await fetchChartData(`duracion_${time}`);
            if(!chartData) setStatLine('');
            console.log(chartData);
            setLineData(chartData);
        }
    };

    // Funciones manejadoras de la grafica de Torta
    const handleStatPieChange = (event) => {
        setStatPie(event.target.value);
        graficarPie(event.target.value);
    }
    const graficarPie = async (stat = statPie, time = timeStat, parqueadero = selectedParqueadero) => {
        if (parqueadero && stat) {
            const chartData = await fetchChartData(`proporcion_${time}`);
            if(!chartData) setStatPie('');
            console.log(chartData);
            setPieData(chartData);
        }
    };


    // Funciones manejadoras de Cambio en los tiempos y el parqueadero (Si es admin general)
    const handleTimeStatChange = (event) => {
        setTimeStat(event.target.value);
        graficarBarras(statBar, event.target.value);
        graficarLineas(statLine, event.target.value);
        graficarPie(statLine, event.target.value);
    };

    const handleParqueaderoChange = (event) => {
        setSelectedParqueadero(event.target.value);
        setStatBar('');
        setStatLine('');
        setStatPie('');
    };


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
                    {selectedParqueadero && 
                        <div className="scrollable-container">
                            <div className="graficaEstadistica">
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                                        <InputLabel id="demo-simple-select-standard-label">Variable</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={statBar}
                                            onChange={handleStatBarChange}
                                            label="Age"
                                        >
                                            <MenuItem value={""}>Variable</MenuItem>
                                            <MenuItem value={1}>Cantidad de reservas hechas</MenuItem>
                                        </Select>
                                    </FormControl>
                                <div className="chart-container">
                                    {!statBar && <h2>Selecciona la variable a graficar</h2>}
                                    {(statBar && barData) && <BarChart data={barData} />}
                                </div>
                            </div>
                            <div className="graficaEstadistica">
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                                        <InputLabel id="demo-simple-select-standard-label">Variable</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={statLine}
                                            onChange={handleStatLineChange}
                                            label="Age"
                                        >
                                            <MenuItem value={""}>Variable</MenuItem>
                                            <MenuItem value={1}>Duracion de las reservas</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <div className="chart-container">
                                    {!statLine && <h2>Selecciona la variable a graficar</h2>}
                                    {(statLine && lineData) && <LineChart data={lineData} />}
                                </div>
                            </div>
                            <div className="graficaEstadistica">
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                                        <InputLabel id="demo-simple-select-standard-label">Variable</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={statPie}
                                            onChange={handleStatPieChange}
                                            label="Age"
                                        >
                                            <MenuItem value={""}>Variable</MenuItem>
                                            <MenuItem value={1}>Proporcion de reservas por duracion</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <div className="chart-container">
                                    {!statPie && <h2>Selecciona la variable a graficar</h2>}
                                    {(statPie && pieData) && <PieChart data={pieData} />}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Estadisticas;

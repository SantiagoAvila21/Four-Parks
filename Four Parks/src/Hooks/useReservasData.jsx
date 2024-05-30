import axios from "axios";
import useNotification from "./useNotification";

const useReservasData = (idparqueadero) => {
    const { updateNotification } = useNotification();

    const fetchChartData = async (tipoStat) => {
        try {
            let url = `${import.meta.env.VITE_FLASK_SERVER_URL}/reserva`;
            switch (tipoStat) {
            case "hoy":
                url += `/reservas_hoy/${idparqueadero}`;
                break;
            case "ayer":
                url += `/reservas_ayer/${idparqueadero}`;
                break;
            case "1m":
                url += `/reservas_mes/${idparqueadero}`;
                break;
            case "3m":
                url += `/reservas_tres_meses/${idparqueadero}`;
                break;
            case "duracion_hoy":
                url += `/duracion_reservas_hoy/${idparqueadero}`;
                break;
            case "duracion_ayer":
                url += `/duracion_reservas_ayer/${idparqueadero}`;
                break;
            case "duracion_1m":
                url += `/duracion_reservas_mes/${idparqueadero}`;
                break;
            case "duracion_3m":
                url += `/duracion_reservas_tres_meses/${idparqueadero}`;
                break;
            case "proporcion_hoy":
                url += `/proporcion_reservas_hoy/${idparqueadero}`;
                break;
            case "proporcion_ayer":
                url += `/proporcion_reservas_ayer/${idparqueadero}`;
                break;
            case "proporcion_1m":
                url += `/proporcion_reservas_mes/${idparqueadero}`;
                break;
            case "proporcion_3m":
                url += `/proporcion_reservas_tres_meses/${idparqueadero}`;
                break;
            default:
                throw new Error("Tipo de reserva no válido");
            }
            const response = await axios.get(url);
            
            return response.data;

        } catch (error) {
            console.error(error.response.data.error);
            updateNotification({type: "error", message: error.response.data.error});
        }
    };

    return { fetchChartData };
};

export default useReservasData;

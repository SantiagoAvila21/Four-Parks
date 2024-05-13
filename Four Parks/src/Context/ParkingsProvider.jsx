import { useContext, createContext, useState, useEffect } from "react"
import axios from 'axios'

const ParkingContext = createContext();

/* eslint-disable react/prop-types */
const ParkingProvider = ({ children }) => {
    const [isLoading, setisLoading] = useState(true);
    const [parqueaderos, setParqueaderos] = useState([]);

    const fetchParqueaderos = async (tipo) => {
        setisLoading(true);
        try {
            console.log(`${import.meta.env.VITE_FLASK_SERVER_URL}/api/get_parqueaderos/${tipo}`);
            const response = await axios.get(`${import.meta.env.VITE_FLASK_SERVER_URL}/api/get_parqueaderos/${tipo}`);
      
            console.log('Respuesta del servidor:', response);
            if(response.status == 200){
                setParqueaderos(response.data);
                setisLoading(false);
                return;
            }
          } catch (error) {
            console.error("Error de la solicitud: ", error.response.data.error)
        }
    };

    useEffect(() => {
        fetchParqueaderos("");
    }, []);

    return (
        <ParkingContext.Provider value={{ parqueaderos, isLoading, fetchParqueaderos }} >
            {children}
        </ParkingContext.Provider>
    );
}

export default ParkingProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useParking = () => {
    return useContext(ParkingContext); 
}
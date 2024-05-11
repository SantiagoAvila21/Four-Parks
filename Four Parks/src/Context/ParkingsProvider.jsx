import { useContext, createContext, useState, useEffect } from "react"
import axios from 'axios'

const ParkingContext = createContext();

/* eslint-disable react/prop-types */
const ParkingProvider = ({ children }) => {
    const [parqueaderos, setParqueaderos] = useState([]);

    useEffect(() => {
        const fetchParqueaderos = (async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_FLASK_SERVER_URL}/api/get_parqueaderos`);
          
                console.log('Respuesta del servidor:', response);
                if(response.status == 200){
                    setParqueaderos(response.data);
                    return;
                }
              } catch (error) {
                console.error("Error de la solicitud: ", error.response.data.error)
            }
        })();
    }, []);

    return (
        <ParkingContext.Provider value={{ parqueaderos }} >
            {children}
        </ParkingContext.Provider>
    );
}

export default ParkingProvider;

export const useParking = () => {
    return useContext(ParkingContext); 
}
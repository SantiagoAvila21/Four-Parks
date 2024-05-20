import { useContext, createContext } from "react"

const ReservaContext = createContext();

/* eslint-disable react/prop-types */
const ReservaProvider = ({ children }) => {
    

    return (
        <ReservaContext.Provider value={{  }} >
            {children}
        </ReservaContext.Provider>
    );
}

export default ReservaProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useReserva = () => {
    return useContext(ReservaContext); 
}
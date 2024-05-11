import { useContext, createContext } from "react"

const ParkingContext = createContext();

/* eslint-disable react/prop-types */
export const ParkingProvider = ({ children }) => {
    return (
        <ParkingContext.Provider>
            {children}
        </ParkingContext.Provider>
    );
}

export const useParkingContext = () => useContext(ParkingContext); 
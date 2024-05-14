import { useContext, createContext } from "react";

const CreditContext = createContext();


/* eslint-disable react/prop-types */
export const CreditProvider = ({children}) => {


    return (
        <CreditContext.Provider >
            {children}
        </CreditContext.Provider>
    )
}


// eslint-disable-next-line react-refresh/only-export-components
export const useCredit = () => {
    return useContext(CreditContext);
};
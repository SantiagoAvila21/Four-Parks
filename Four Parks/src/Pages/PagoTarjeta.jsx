import { useEffect, useState } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/CreditRegister.css";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import CardForm from "../components/CardForm";
import axios from 'axios'
import { useAuth } from "../Context/AuthProvider";
import { CircularProgress } from "@mui/material";

const PagoTarjeta = () => {
    const { updateNotification } = useNotification();

    const [isLoadingCard, setIsLoadingCard] = useState(true);
    const auth = useAuth();

    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        cardBrand: '',
        cardType: 'credito',
        expirationDate: '',
        securityCode: '',
        correoelectronico: ''
    });

    useEffect(() => {
        const fetchCard = async () => {
            const userFromLocalStorage = JSON.parse(localStorage.getItem("userLogged"));

            try{
                const responseCard = await axios.get(`${import.meta.env.VITE_FLASK_SERVER_URL}/obtener_tarjeta/${userFromLocalStorage.correo}`);

                if(responseCard.status == 200){
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        cardNumber: responseCard.data.NUMTARJETA,
                        cardholderName: responseCard.data.NOMBREPROPIETARIO,
                        expirationDate: responseCard.data.FECHAVENCIMIENTO,
                        correoelectronico: userFromLocalStorage.correo
                    }));
                }

            }catch (error){
                console.error(error);
                updateNotification({type: 'error', message: 'Ocurrio un error en la aplicación'});
            } finally {
                setIsLoadingCard(false);
            }
        }
        fetchCard();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const handleSubmit = () => {
        console.log("Por los jajas");
        console.log(auth);
    }


    return (
        <div className="Register">
            <SideLogo />
            <div className="register Page">
                <h1>
                    <span>PAGO CON TARJETA</span>
                </h1>
                {isLoadingCard && <CircularProgress />}
                {!isLoadingCard && 
                    <>
                        <CardForm formData={formData} setFormData={setFormData} pago/>
                        <button id="submitButton" type="submit" onClick={handleSubmit}>PAGAR</button>
                    </>
                }
            </div>
            <ToastContainer />
        </div>
    );
}

export default PagoTarjeta;

import { useEffect, useState } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/CreditRegister.css";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import CardForm from "../components/CardForm";
import axios from 'axios'
import { CircularProgress } from "@mui/material";
import { useReserva } from "../Context/ReservaProvider";

const PagoTarjeta = () => {
    const { updateNotification } = useNotification();

    const [isLoadingCard, setIsLoadingCard] = useState(true);
    const { pagarReserva } = useReserva();

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

            const formatCardNumber = (input) => {
                return input
                    .replace(/\D/g, '') // Eliminar caracteres no numéricos
                    .replace(/(.{4})/g, '$1 ') // Insertar un espacio cada 4 dígitos
                    .trim(); // Eliminar espacios en blanco al principio y al final
            };
            
            try{
                const responseCard = await axios.get(`${import.meta.env.VITE_FLASK_SERVER_URL}/obtener_tarjeta/${userFromLocalStorage.correo}`);

                if(responseCard.status == 200){
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        cardNumber: formatCardNumber(responseCard.data.NUMTARJETA),
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


    const handleSubmit = (event) => {
        event.preventDefault();
    
        if (Object.values(formData).includes('')) {
            updateNotification({ type: 'error', message: 'Todos los campos son obligatorios.' });
            return;
        }
    
        // Otras validaciones pueden incluir la fecha de vencimiento y el código de seguridad
        const currentYear = new Date().getFullYear() % 100; // Año actual en dos dígitos
        const currentMonth = new Date().getMonth() + 1; // Mes actual
        const [expMonth, expYear] = formData.expirationDate.split('/');
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            updateNotification({ type: 'error', message: 'La tarjeta ha expirado.' });
            return;
        }
    
        if (formData.securityCode.length !== 3) {
            updateNotification({ type: 'error', message: 'El código de seguridad debe tener 3 dígitos.' });
            return;
        }

        pagarReserva({
            correoelectronico: formData.correoelectronico,
            security_code: formData.securityCode,
            f_expiracion: formData.expirationDate,
            numtarjeta: formData.cardNumber,
            nombre: formData.cardholderName
        });
    };


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

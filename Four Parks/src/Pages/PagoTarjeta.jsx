import { useEffect, useState } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/CreditRegister.css";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import CardForm from "../components/CardForm";
import axios from 'axios'
import { CircularProgress } from "@mui/material";
import { useReserva } from "../Context/ReservaProvider";
import Modal from "../components/Modal";
import { useNavigate } from "react-router";

const PagoTarjeta = () => {
    const { updateNotification } = useNotification();

    const [showModal, setshowModal] = useState(false);
    const [isLoadingCard, setIsLoadingCard] = useState(true);
    const { pagarReserva, reserva } = useReserva();
    const navigate = useNavigate();

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

        console.log(reserva.parqueaderoSelected);
    
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
        }, () => {setshowModal((prev) => !prev)});
    };


    return (
        <div className="Register">
            <Modal shouldShow={showModal} green="green">
                <div className="reservaRealizada">
                    <h1>RESERVA REALIZADA</h1>
                    <div className="reservaInfo">
                        <h5>NÚMERO DE FACTURA</h5>
                        <p>{reserva.numfactura}</p>
                        <h5>NOMBRE</h5>
                        <p>{JSON.parse(localStorage.getItem('userLogged')).usuario.replace('_', ' ')}</p>
                        <h5>PLACA</h5>
                        <p>{reserva.placa}</p>
                        <h5>PARQUEADERO</h5>
                        <p>{reserva.parqueaderoSelected[2]}</p>
                        <h5>TIPO DE VEHICULO</h5>
                        <p>{reserva.tipoVehiculo}</p>
                        <h5>FECHA LLEGADA</h5>
                        <p>{reserva.fechaEntradaFormateada}</p>
                        <h5>FECHA SALIDA</h5>
                        <p>{reserva.fechaSalidaFormateada}</p>
                        <h5>COSTO</h5>
                        <p>${reserva.monto},0</p>
                    </div>
                    <button id="submitButton" type="submit" onClick={() => navigate("/")}>VOLVER A PAGINA PRINCIPAL</button>
                </div>
            </Modal>
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

import { useState } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/CreditRegister.css";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import { useCard } from "../Context/CardProvider";
import { useLocation } from "react-router";
import CardForm from "../components/CardForm";

const CreditRegister = () => {
    const { updateNotification } = useNotification();
    const location = useLocation();
    const { correoelectronico } = location.state || {};

    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        cardBrand: '',
        cardType: 'credito',
        expirationDate: '',
        securityCode: '',
        correoelectronico
    });

    const { registerCard } = useCard();

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(location);
    
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

        registerCard(formData);
    };    

    return (
        <div className="Register">
            <SideLogo />
            <div className="register Page">
                <h1>
                    <span>REGISTRAR MÉTODO</span>
                    <span>DE PAGO</span>
                </h1>
                <CardForm formData={formData} setFormData={setFormData} />
                <button id="submitButton" type="submit" onClick={handleSubmit}>REGISTRAR</button>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CreditRegister;

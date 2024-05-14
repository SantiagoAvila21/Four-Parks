import { useState } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/CreditRegister.css";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import Radio from '@mui/material/Radio';
import { FaUser, FaCreditCard, FaCcVisa, FaCcMastercard } from "react-icons/fa";

const CreditRegister = () => {
    const { updateNotification } = useNotification();
    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        cardType: '',
        expirationDate: '',
        securityCode: '',
        email: ''
    });

    // Función para detectar el tipo de tarjeta
    const detectCardType = (cardNumber) => {
        if (/^4/.test(cardNumber)) {
            setFormData(prevState => ({ ...prevState, cardType: 'Visa' }));
        } else if (/^5[1-5]/.test(cardNumber)) {
            setFormData(prevState => ({ ...prevState, cardType: 'Mastercard' }));
        } else {
            setFormData(prevState => ({ ...prevState, cardType: '' }));
        }
    };

    // Función para formatear el número de tarjeta
    const formatCardNumber = (input) => {
        return input
            .replace(/\D/g, '') // Eliminar caracteres no numéricos
            .replace(/(.{4})/g, '$1 ') // Insertar un espacio cada 4 dígitos
            .trim(); // Eliminar espacios en blanco al principio y al final
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'cardNumber') {
            const formattedInput = formatCardNumber(value);
            setFormData(prevState => ({ ...prevState, cardNumber: formattedInput }));
            detectCardType(formattedInput);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        if (Object.values(formData).some(item => item === '')) {
            updateNotification({ type: 'error', message: 'Todos los campos son obligatorios.' });
            return;
        }

        const cardNumber = formData.cardNumber.replace(/\s+/g, ''); // Elimina espacios en blanco
        if (!cardNumber.match(/^[0-9]+$/)) {
            updateNotification({ type: 'error', message: 'El número de tarjeta solo debe contener números.' });
            return;
        }
    
        if (cardNumber.length !== 16) {
            updateNotification({ type: 'error', message: 'El número de tarjeta debe tener 16 dígitos.' });
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
    
        //aquí la lógica de envío de los datos de la tarjeta para el procesamiento del pago
        console.log("Datos del formulario de pago:", formData);
    };    

    return (
        <div className="Register">
            <SideLogo />
            <div className="register Page">
                <h1>
                    <span>REGISTRAR TARJETA</span>
                    <span>DE CRÉDITO</span>
                </h1>
                <div className="register Form">
                    <form onSubmit={handleSubmit}>
                        <div className="register info" style={{ position: 'relative' }}>
                            <label>NOMBRE DEL TITULAR DE LA TARJETA</label>
                            <input type="text" name="cardholderName" value={formData.cardholderName} onChange={handleChange} className="inputForm" style={{ paddingLeft: '30px' }} />
                            <FaUser style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />
                        </div>
                        <div className="register info" style={{ position: 'relative' }}>
                            <label>NÚMERO DE TARJETA</label>
                            <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} className="inputForm" style={{ paddingLeft: '30px' }} maxLength={18}/>
                            {formData.cardType === 'Visa' && <FaCcVisa style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />}
                            {formData.cardType === 'Mastercard' && <FaCcMastercard style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />}
                            {!formData.cardType && <FaCreditCard style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />}
                        </div>
                        <div>
                            <label>TIPO DE TARJETA</label>
                            <Radio
                                checked={formData.cardType === 'a'}
                                onChange={handleChange}
                                value="a"
                                name="radio-buttons"
                                label="jaja"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                            <Radio
                                checked={formData.cardType === 'b'}
                                onChange={handleChange}
                                value="b"
                                name="radio-buttons"
                                label="jaja2"
                                inputProps={{ 'aria-label': 'B' }}
                            />
                        </div>
                        <div className="register info">
                            <label>FECHA DE VENCIMIENTO</label>
                            <input type="text" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className="inputForm"/>
                        </div>
                        <div className="register info">
                            <label>CÓDIGO DE SEGURIDAD</label>
                            <input type="text" name="securityCode" value={formData.securityCode} onChange={handleChange} className="inputForm"/>
                        </div>
                        <div className="register info">
                            <label>CORREO ELECTRÓNICO</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="inputForm"/>
                        </div>
                        <button id="submitButton" type="submit">PAGAR</button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CreditRegister;

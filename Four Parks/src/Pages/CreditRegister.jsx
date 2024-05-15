import { useState } from "react";
import SideLogo from "../components/SideLogo";
import "../styles/CreditRegister.css";
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification";
import { FaUser, FaCreditCard, FaCcVisa, FaCcMastercard } from "react-icons/fa";

const CreditRegister = () => {
    const { updateNotification } = useNotification();
    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        cardBrand: '',
        cardType: 'credito',
        expirationDate: '',
        securityCode: '',
    });

    // Función para detectar la marca de tarjeta
    const detectCardBrand = (cardNumber) => {
        if (/^4/.test(cardNumber)) {
            setFormData(prevState => ({ ...prevState, cardBrand: 'Visa' }));
        } else if (/^5[1-5]/.test(cardNumber)) {
            setFormData(prevState => ({ ...prevState, cardBrand: 'Mastercard' }));
        } else {
            setFormData(prevState => ({ ...prevState, cardBrand: '' }));
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
            detectCardBrand(formattedInput);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(formData);
    
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
                        <div className="numberCard info" style={{ position: 'relative' }}>
                            <label>NÚMERO DE TARJETA</label>
                            <input type="text" placeholder="4242 4242 4242 424" name="cardNumber" value={formData.cardNumber} onChange={handleChange} className="inputForm" style={{ paddingLeft: '30px' }} maxLength={18}/>
                            {formData.cardBrand === 'Visa' && <FaCcVisa style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />}
                            {formData.cardBrand === 'Mastercard' && <FaCcMastercard style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />}
                            {!formData.cardBrand && <FaCreditCard style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />}
                        </div>
                        <div className="radioDiv">
                            <label>
                                <input
                                    type="radio"
                                    name="cardType"
                                    value="credito"
                                    id="radioButtonCredito"
                                    checked={formData.cardType === "credito"}
                                    onChange={handleChange}
                                /> Crédito
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="cardType"
                                    value="debito"
                                    id="radioButtonDebito"
                                    checked={formData.cardType === "debito"}
                                    onChange={handleChange}
                                /> Débito
                            </label>
                        </div>
                        <div id="fechaCodDiv">
                            <div className="fechaCardinfo">
                                <label>FECHA DE VENCIMIENTO</label>
                                <input type="text" name="expirationDate" placeholder="MM/YY" value={formData.expirationDate} onChange={handleChange} className="inputForm"/>
                            </div>
                            <div className="codeCardinfo">
                                <label>CÓDIGO DE SEGURIDAD</label>
                                <input type="text" name="securityCode" placeholder="CVV" value={formData.securityCode} onChange={handleChange} className="inputForm"/>
                            </div>
                        </div>
                    </form>
                </div>
                <button id="submitButton" type="submit" onClick={handleSubmit}>REGISTRAR</button>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CreditRegister;

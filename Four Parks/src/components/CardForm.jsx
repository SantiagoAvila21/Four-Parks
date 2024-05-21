import "../styles/CreditRegister.css";
import { FaUser, FaCreditCard, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { useEffect } from "react";

/* eslint-disable react/prop-types */
const CardForm = ({ formData, setFormData, pago }) => {
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

    useEffect(() => {
        detectCardBrand(formData.cardNumber);
    }, [formData.cardNumber]);

    return (
        <div className="register Form">
            <form>
                <div className="register info" style={{ position: 'relative' }}>
                    <label>NOMBRE DEL TITULAR DE LA TARJETA</label>
                    <input
                        type="text"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleChange}
                        className="inputForm"
                        style={{ paddingLeft: '30px' }}
                    />
                    <FaUser style={{ position: 'absolute', left: '5px', top: '52%', transform: 'translateY(-50%)' }} />
                </div>
                <div className="numberCard info" style={{ position: 'relative' }}>
                    <label>NÚMERO DE TARJETA</label>
                    <input
                        type="text"
                        placeholder="4242 4242 4242 424"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="inputForm"
                        style={{ paddingLeft: '30px' }}
                        maxLength={18}
                    />
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
                        <input
                            type="text"
                            name="expirationDate"
                            placeholder="MM/YY"
                            value={formData.expirationDate}
                            onChange={handleChange}
                            className="inputForm"
                        />
                    </div>
                    <div className="codeCardinfo">
                        <label>CÓDIGO DE SEGURIDAD</label>
                        <input
                            type="text"
                            name="securityCode"
                            placeholder="CVV"
                            value={formData.securityCode}
                            onChange={handleChange}
                            className="inputForm"
                        />
                    </div>
                </div>
                {pago && 
                    <div className="register info" style={{ position: 'relative' }}>
                        <label>CORREO A ENVIAR LA FACTURA</label>
                        <input type="text" name="correoelectronico" value={formData.correoelectronico} onChange={handleChange} className="inputForm"/>
                    </div>
                }
            </form>
        </div>
    );
}

export default CardForm;
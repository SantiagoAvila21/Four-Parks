import datetime

def verify_card_type(card_number):
    """
    Verifica el tipo de tarjeta de crédito basado en el número de la tarjeta.
    
    Args:
    card_number (str): Número de la tarjeta de crédito.
    
    Returns:
    str: Tipo de tarjeta ("Visa", "MasterCard" o "Desconocido").
    """
    if card_number.startswith('4'):
        return "Visa"
    elif card_number.startswith(('51', '52', '53', '54', '55')):
        return "MasterCard"
    else:
        return "Desconocido"

def is_valid_card_number(card_number):
    """
    Verifica si el número de tarjeta es válido usando el algoritmo de Luhn.
    
    Args:
    card_number (str): Número de la tarjeta a verificar.
    
    Returns:
    bool: True si es válido, False en caso contrario.
    """
    def digits_of(n):
        return [int(d) for d in str(n)]
    digits = digits_of(card_number)
    odd_digits = digits[-1::-2]
    even_digits = digits[-2::-2]
    checksum = sum(odd_digits)
    for d in even_digits:
        checksum += sum(digits_of(d*2))
    return checksum % 10 == 0

def is_valid_expiry_date(expiry_date):
    """
    Verifica si la fecha de expiración de la tarjeta no ha pasado.
    
    Args:
    expiry_date (str): Fecha de vencimiento en formato 'MM/YY'.
    
    Returns:
    bool: True si la fecha es válida, False si ha expirado.
    """
    current_date = datetime.datetime.now()
    month, year = map(int, expiry_date.split('/'))
    expiry_date = datetime.datetime(year=2000 + year, month=month, day=1)
    return expiry_date > current_date

def process_payment(cardholder_name, card_number, expiry_date, security_code, email):
    """
    Procesa el pago simulando una transacción de tarjeta de crédito.
    
    Args:
    cardholder_name (str): Nombre del titular de la tarjeta.
    card_number (str): Número de la tarjeta de crédito.
    expiry_date (str): Fecha de vencimiento de la tarjeta.
    security_code (str): Código de seguridad de la tarjeta.
    email (str): Correo electrónico del titular.
    
    Returns:
    dict: Resultado del intento de procesamiento del pago.
    """
    if not is_valid_card_number(card_number):
        return {"error": True, "message": "Número de tarjeta inválido."}
    
    if not is_valid_expiry_date(expiry_date):
        return {"error": True, "message": "La tarjeta ha expirado."}
    
    card_type = verify_card_type(card_number)
    if card_type == "Desconocido":
        return {"error": True, "message": "Tipo de tarjeta no soportado."}

    # Simulación de procesamiento de pago
    print(f"Procesando pago para {cardholder_name} con tarjeta {card_type}")
    return {"success": True, "message": f"Pago procesado correctamente con {card_type}, recibo enviado a {email}"}

def registrar_tarjeta(card_number, expiry_date, security_code):
    """
    Procesa el pago simulando una transacción de tarjeta de crédito.
    
    Args:
    card_number (str): Número de la tarjeta de crédito.
    expiry_date (str): Fecha de vencimiento de la tarjeta.
    security_code (str): Código de seguridad de la tarjeta.
    
    Returns:
    dict: Resultado del intento de registro de tarjeta.
    """
    if not is_valid_card_number(card_number):
        return {"error": True, "message": "Número de tarjeta inválido."}
    
    if not is_valid_expiry_date(expiry_date):
        return {"error": True, "message": "La tarjeta ha expirado."}
    
    card_type = verify_card_type(card_number)
    if card_type == "Desconocido":
        return {"error": True, "message": "Tipo de tarjeta no soportado."}

    return {"success": True, "message": "Tarjeta registrada correctamente"}

const generarNumeroFactura = () => {
    const letras = Array.from({ length: 3 }, () => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
    
    const numeros = Array.from({ length: 7 }, () => 
        Math.floor(Math.random() * 10)
    ).join('');
    
    return letras + numeros;
}

export default generarNumeroFactura;
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { ImCross } from "react-icons/im";


// Función para crear filas a partir de los datos proporcionados
function createData(parqueadero, fechareserva, costo, puntos) {

    // Crear un objeto Date a partir del string
    const fecha = new Date(fechareserva);

    // Extraer el día, mes y año
    const dia = fecha.getUTCDate();
    const mes = fecha.getUTCMonth() + 1; // Los meses son indexados desde 0, por lo que enero es 0 y diciembre es 11
    const año = fecha.getUTCFullYear();

    // Formatear la fecha como dd/mm/yyyy
    const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`;

    return { parqueadero , fechaFormateada, costo, puntos };
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#5D5D5D',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

// Componente de tabla
/* eslint-disable react/prop-types */
const TablaReservas = ({ reservas, cb }) => {
    //c onst auth = useAuth();

    useEffect(() => {
        console.log(reservas);
    }, []);

    /* const handleChangeRol = (idtipousuario, correo) => {
        cb(correo, idtipousuario);
    } */
    reservas = reservas.map(reserva => createData(reserva.nombreparqueadero, reserva.fechareserva, reserva.costo, reserva.puntos));

    //const usuarios = reservas.map(reserva => createData(...usuario));

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <StyledTableCell align="left">Parqueadero</StyledTableCell>
                <StyledTableCell align="left">Fecha</StyledTableCell>
                <StyledTableCell align="left">Costo</StyledTableCell>
                <StyledTableCell align="left">Puntos</StyledTableCell>
                <StyledTableCell align="left">Cancelar</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {reservas.map((reserva) => (
                <TableRow key={reserva.parqueadero}>
                    <TableCell component="th" scope="row">
                        {reserva.parqueadero}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {reserva.fechaFormateada}
                    </TableCell>
                    <TableCell align="left">
                        {reserva.costo}
                    </TableCell>
                    <TableCell align="left">
                        {reserva.puntos}
                    </TableCell>
                    <TableCell align="center">
                        <ImCross className='cancelarButton' onClick={cb}/>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default TablaReservas;
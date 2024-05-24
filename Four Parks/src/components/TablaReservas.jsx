import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { ImCross } from "react-icons/im";
import moment from 'moment'


// Función para crear filas a partir de los datos proporcionados
function createData(parqueadero, fechareserva, costo, puntos, numreserva, estado) {

    // Crear un objeto Moment a partir del string y establecer la zona horaria como UTC
    const fecha = moment.utc(fechareserva);

    // Formatear la fecha sin alterar la hora
    const fechaFormateada = fecha.format('DD/MM/YYYY, h a');

    return { parqueadero , fechaFormateada, costo, puntos, numreserva, estado };
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

    reservas = reservas.map(reserva => createData(reserva.nombreparqueadero, reserva.fechareserva, reserva.costo, reserva.puntos, reserva.numreserva, reserva.estado));

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
                <TableRow key={reserva.numreserva}>
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
                        { reserva.estado == 'Cancelar' && <ImCross className='cancelarButton' onClick={() => cb(reserva.numreserva, reserva.parqueadero)}/> }
                        { reserva.estado != 'Cancelar' && <p>{ reserva.estado }</p> }
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default TablaReservas;
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { IoLockClosedSharp, IoLockOpenOutline } from "react-icons/io5";
import { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthProvider";

// Función para crear filas a partir de los datos proporcionados
function createData(nombre, apellido, email, tipousuario, estado) {
  return { nombre, apellido, email, tipousuario, estado };
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
const TablaUsuarios = ({ users, cb, fetchUsers }) => {
    const [usuariosFull, setUsuariosFull] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        let usuarios = users.map(subarray => {
            let nombreCompleto = subarray[0].split("_");
            return [...nombreCompleto, ...subarray.slice(1)];
        });
        setUsuariosFull(usuarios);
    }, [users]);

    const handleChangeRol = (idtipousuario, correo) => {
        cb(correo, idtipousuario);
    }

    const usuarios = usuariosFull.map(usuario => createData(...usuario));

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <StyledTableCell align="left">Nombre</StyledTableCell>
                <StyledTableCell align="left">Apellido</StyledTableCell>
                <StyledTableCell align="left">Correo Electrónico</StyledTableCell>
                <StyledTableCell align="left">Tipo/Usuario</StyledTableCell>
                <StyledTableCell align="left">Estado</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {usuarios.map((usuario) => (
                <TableRow key={`${usuario.email}`}>
                    <TableCell component="th" scope="row">
                        {usuario.nombre}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {usuario.apellido}
                    </TableCell>
                    <TableCell align="left">{usuario.email}</TableCell>
                    <TableCell align="left">
                        {usuario.tipousuario == 2 ? (
                            <><span className='rolChange' onClick={() => handleChangeRol(3, usuario.email)}>Cliente</span> <span><u>Admin</u></span></>
                        ) : (
                            <><span><u>Cliente</u></span> <span className='rolChange' onClick={() => handleChangeRol(2, usuario.email)}>Admin</span></>
                        )}
                    </TableCell>
                    <TableCell align="left">{usuario.estado == 'unlocked' ? <IoLockOpenOutline /> : <IoLockClosedSharp className="blocked" onClick={() => {
                        auth.unlockAction(usuario.email)
                        fetchUsers()
                    }} /> }
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default TablaUsuarios;
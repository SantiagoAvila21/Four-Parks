import Home from './Pages/Home';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register'
import ParkingProvider from './Context/ParkingsProvider';
import Reserva from './Pages/Reserva';
import CreditRegister from './Pages/CreditRegister'
import MisReservas from './Pages/MisReservas';
import Usuarios from './Pages/Usuarios';
import { useAuth } from './Context/AuthProvider';
import { Navigate } from 'react-router-dom';

/* eslint-disable react/prop-types */
const RequireAuth = ({ children, adminGeneral }) => {
  const auth = useAuth();
  const userFromLocalStorage = localStorage.getItem("userLogged");
  const userJSON = JSON.parse(userFromLocalStorage);
  if(adminGeneral && userJSON.tipoUsuario != 'Administrador General') return <Navigate to="/" />;
  if (!auth.user && !userFromLocalStorage) return <Navigate to="/login" />;
  return children;
}


function App() {
  return (
    <div className='App'>
      <ParkingProvider>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/users' element={<RequireAuth adminGeneral> <Usuarios/> </RequireAuth>} />
            <Route path='/reserva' element={<RequireAuth><Reserva /></RequireAuth>} />
            <Route path='/mis_reservas' element={<RequireAuth><MisReservas /></RequireAuth>} />
            <Route path='/crear_tarjeta' element={<RequireAuth><CreditRegister /></RequireAuth>} />
          </Routes>
      </ParkingProvider>
    </div>
  )
}

export default App

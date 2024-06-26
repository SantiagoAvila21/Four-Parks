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
import CardProvider from './Context/CardProvider';
import PagoTarjeta from './Pages/PagoTarjeta';
import ReservaProvider from './Context/ReservaProvider';
import CaracteristicasPunto from './Pages/CaracteristicasPunto';
import Estadisticas from './Pages/Estadisticas';
import Landing from './Pages/Landing';

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
      <CardProvider>
        <ParkingProvider>
          <ReservaProvider>
            <Routes>
              <Route path='/' element={<Landing/>} />
              <Route path='/app' element={<Home/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='/users' element={<RequireAuth adminGeneral> <Usuarios/> </RequireAuth>} />
              <Route path='/reserva' element={<RequireAuth><Reserva /></RequireAuth>} />
              <Route path='/mis_reservas' element={<RequireAuth><MisReservas /></RequireAuth>} />
              <Route path='/crear_tarjeta' element={<CreditRegister />} />
              <Route path='/pago_tarjeta' element={<RequireAuth><PagoTarjeta /></RequireAuth>} />
              <Route path='/caracteristicas' element={<RequireAuth><CaracteristicasPunto /></RequireAuth>} />
              <Route path='/stats' element={<RequireAuth><Estadisticas /></RequireAuth>} />
            </Routes>
          </ReservaProvider>
        </ParkingProvider>
      </CardProvider>
    </div>
  )
}

export default App

import Home from './Pages/Home';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register'
import AuthProvider from './Context/AuthProvider';
import ParkingProvider from './Context/ParkingsProvider';
import Reserva from './Pages/Reserva';

function App() {

  return (
    <div className='App'>
      <ParkingProvider>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/reserva' element={<Reserva />} />
          </Routes>
        </AuthProvider>
      </ParkingProvider>
    </div>
  )
}

export default App

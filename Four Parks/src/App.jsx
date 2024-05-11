import Home from './components/Pages/Home';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register'
import AuthProvider from './Context/AuthProvider';
import ParkingProvider from './Context/ParkingsProvider';

function App() {

  return (
    <div className='App'>
      <ParkingProvider>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
          </Routes>
        </AuthProvider>
      </ParkingProvider>
    </div>
  )
}

export default App

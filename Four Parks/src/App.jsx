import Home from './components/Pages/Home';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register'
import AuthProvider from './Context/AuthProvider';

function App() {

  return (
    <div className='App'>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App

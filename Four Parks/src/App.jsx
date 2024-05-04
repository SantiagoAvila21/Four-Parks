import Home from './components/Pages/Home';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register'

function App() {

  return (
    <div className='App'>
      <Routes>
         <Route path='/' element={<Home/>} />
         <Route path='/login' element={<Login/>} />
         <Route path='/register' element={<Register/>} />
       </Routes>
    </div>
  )
}

export default App

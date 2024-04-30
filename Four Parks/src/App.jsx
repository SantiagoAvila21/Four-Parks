import Home from './components/Home';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';

function App() {

  return (
    <div className='App'>
      <Routes>
         <Route path='/' element={<Home/>} />
         <Route path='/login' element={<Login/>} />
         {/* <Route path='/contact' element={<Contact/>} /> */}
       </Routes>
    </div>
  )
}

export default App

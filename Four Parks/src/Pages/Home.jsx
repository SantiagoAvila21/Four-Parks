import { useEffect, useState } from "react"
import TopBar from "../components/TopBar"
import Sidebar from "../components/Sidebar"
import MyMap from "../components/MyMap"
import '../styles/Home.css'
import { MarkerProvider } from "../Context/MarkerProvider"
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification"
import { useAuth } from "../Context/AuthProvider"
import Modal from "../components/Modal"
import { useParking } from "../Context/ParkingsProvider"

const Home = () => {
  const { updateNotification } = useNotification();
  const { fetchParqueaderos } = useParking();
  const auth = useAuth();
  const [showModal, setshowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const onChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
  }

  const handleChangePassword = (event) => {
    event.preventDefault();
    // Revisar si el formulario tiene datos
    if(!validatePassword(newPassword)){
      updateNotification({type: 'error', message: 'La contraseña debe tener a lo maximo 8 caracteres y contener al menos un número, una letra minúscula y una letra mayúscula.'})
      return;
  }
    auth.changePassw({email: auth.user.correo, password: newPassword}, () => {setshowModal(false)});
  }

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    const handleFirstLogin = async () => {
      if (auth.state === 'first_logged') {
        updateNotification({ type: 'success', message: 'Inicio de sesión exitoso.', position: 'top-left' });
        setshowModal(true);
      } else if (auth.state === 'logged') {
        updateNotification({ type: 'success', message: 'Inicio de sesión exitoso.', position: 'top-left' });
      }
    };
    fetchParqueaderos("");
    
    handleFirstLogin();
    auth.setState('');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="Home">
        <Modal shouldShow={showModal}>
          <div className="twoFactor">
            <p>Al ser la primera vez que inicias sesion, por favor ingresa tu nueva contraseña</p>
            <input 
              type="password" 
              value={newPassword} 
              onChange={onChangeNewPassword}
              className="inputForm"  
              placeholder="Nueva Contraseña"
            />
            <button id="submitButton" type="submit" onClick={handleChangePassword}>CAMBIAR CONTRASEÑA</button>
          </div>
        </Modal>
        <TopBar />
        <MarkerProvider>
          <div className='contentDiv'>
              <Sidebar />
              <MyMap />
          </div>
        </MarkerProvider>
        <ToastContainer />
    </div>
  )
}

export default Home
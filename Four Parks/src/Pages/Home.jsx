import { useEffect } from "react"
import TopBar from "../components/TopBar"
import Sidebar from "../components/Sidebar"
import MyMap from "../components/MyMap"
import '../styles/Home.css'
import { MarkerProvider } from "../Context/MarkerProvider"
import { ToastContainer } from "react-toastify";
import useNotification from "../Hooks/useNotification"
import { useAuth } from "../Context/AuthProvider"

const Home = () => {
  const { updateNotification } = useNotification();
  const auth = useAuth();

  useEffect(() => {
    if(auth.state == 'logged') updateNotification({type: "success", message: "Inicio de sesion exitoso."});
    
    auth.setState("");
  },[]);

  return (
    <div className="Home">
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
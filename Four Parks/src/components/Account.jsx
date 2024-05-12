import '../styles/Account.css'
import { useAuth } from '../Context/AuthProvider'

const Account = () => {
    const auth = useAuth();

    return (
    <div className='accountDiv'>
        <h3> Tu cuenta </h3>
        <p> Puntos Fidelizacion: {'25 puntos'}</p>
        <h4 onClick={() => auth.logOut()}> Cerrar cuenta </h4>
    </div>
  )
}

export default Account
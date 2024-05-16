import '../styles/Account.css'
import { useAuth } from '../Context/AuthProvider'
import { Link } from 'react-router-dom';

const Account = () => {
    const auth = useAuth();

    const opcionesAdminGeneral = <>
      <h5>Administrador General</h5>
      <Link to='/users'>Usuarios</Link>
      <Link to='/stats'>Estadisticas</Link>
    </>;

    const opcionesAdminPunto = <>
      <h5>Administrador de Punto</h5>
      <Link to='/stats2'>Estadisticas de Punto</Link>
    </>


    return (
      <div className='accountDiv'>
          <h3> Tu cuenta </h3>
          {auth.user.tipoUsuario == 'Administrador General' && opcionesAdminGeneral}
          {auth.user.tipoUsuario == 'Administrador de Punto' && opcionesAdminPunto}

          <p> Puntos Fidelizacion: {'25 puntos'}</p>
          <h4 onClick={() => auth.logOut()}> Cerrar cuenta </h4>
      </div>
    )
}

export default Account
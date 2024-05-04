import './styles/Sidebar.css'
import parkImg from '../assets/Parkimg.png'

const Sidebar = () => {
  return (
    <div className="sidebar">
        <img src={parkImg} alt='Imagen Parqueadero' />
        <div className="filter">

        </div>
        
    </div>
  )
}

export default Sidebar
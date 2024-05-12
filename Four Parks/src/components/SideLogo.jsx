import '../styles/Sidelogo.css'
import logoFP from '../assets/FourParksLogo.png'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate  } from "react-router-dom";


function SideLogo() {
  let history = useNavigate();

  const goBack = () => history(-1)
  
  return (
    <div className = "sideLogo">
        <MdOutlineKeyboardArrowLeft id="arrowBack" onClick={goBack} />
        <img src={logoFP} alt="Logo Four Parks" />
        <h2>Four Parks</h2>
    </div>
  )
}

export default SideLogo
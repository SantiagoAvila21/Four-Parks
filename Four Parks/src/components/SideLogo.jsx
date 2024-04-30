import './styles/Sidelogo.css'
import logoFP from '../assets/FourParksLogo.png'

function SideLogo() {
  return (
    <div className = "sideLogo">
        <img src={logoFP} alt="Logo Four Parks" />
        <h2>Four Parks</h2>
    </div>
  )
}

export default SideLogo
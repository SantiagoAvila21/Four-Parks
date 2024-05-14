import SideLogo from "../components/SideLogo";
import "../styles/MisReservas.css";
import { ToastContainer } from "react-toastify";

const MisReservas = () => {
    return (
        <div className="MisReservas">
            <SideLogo />
            <div className="misReservas Page">
                <h2> Mis Reservas </h2>
            </div>
            <ToastContainer />
        </div>
    )
}

export default MisReservas;
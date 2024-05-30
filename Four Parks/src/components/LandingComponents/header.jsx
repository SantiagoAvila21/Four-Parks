import "../../styles/bootstrap.scss"
import "../../styles/style.scss"
import { Link } from 'react-router-dom';

/* eslint-disable react/prop-types */
export const Header = (props) => {
  return (
    <div className="local-bootstrap">
      <header id="header">
        <div className="container headerDiv" style={{marginTop: "100px", width: "100%" ,height: "500px"}}>
          <h2 style={{color: "black", fontWeight: "bold"}}>{props.data.title}</h2>
          <p style={{color: "black"}}>{props.data.paragraph}</p>
          <Link to="/app" className="btn btn-custom btn-lg page-scroll">¡Reserva ahora!</Link>
        </div>
      </header>
    </div>
  );
};

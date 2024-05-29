import "../../../css/bootstrap.scss"
import "../../../css/style.scss"

/* eslint-disable react/prop-types */
export const Header = (props) => {
  return (
    <div className="local-bootstrap">
      <header id="header">
<<<<<<< HEAD
        <div className="container headerDiv" style={{marginTop: "100px", width: "100%" ,height: "500px", backgroundColor: "red"}}>
          <h2 style={{color: "black", fontWeight: "bold"}}>{props.data.title}</h2>
=======
        <div className="headerDiv" style={{marginTop: "100px", width: "100%" ,height: "500px", backgroundColor: "red"}}>
          <h2 style={{color: "black"}}>{props.data.title}</h2>
>>>>>>> 3a09f2c (Se añaden las siguientes funcionalidades: 1. Exportacion de las graficas del modulo de estadisticas en PDF 2. Iconos en distintos sitios de la app, para que se vea de manera mas amigable 3. De parte del backend, el scheduler, no añade espacios de mas cada hora, sino que ahora revisa en las horas fijas tanto si se inicia una reserva como si se termina 3. No permitir que una persona realice una reserva si tiene otra reserva hecha que se cruza con la que quiere crear)
          <p style={{color: "black"}}>{props.data.paragraph}</p>
          <a
            href="/app"
            className="btn btn-custom btn-lg page-scroll"
          >
            ¡Reserva ahora!
          </a>{" "}
        </div>
      </header>
    </div>
  );
};

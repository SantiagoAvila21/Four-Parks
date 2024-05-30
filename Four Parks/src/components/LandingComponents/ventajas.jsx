import "../../styles/bootstrap.scss"
import "../../styles/style.scss"

/* eslint-disable react/prop-types */
export const Services = (props) => {
  return (
    <div className="local-bootstrap">
      <div id="services" className="text-center">
        <div className="container">
          <div className="section-title">
            <h2><strong>¿Por qué escogernos?</strong></h2>
            <p>
              Reserva tu parqueadero en segundos y olvídate de las preocupaciones.
            </p>
          </div>
          <div className="row">
            {props.data
              ? props.data.map((d, i) => (
                  <div key={`${d.name}-${i}`} className="col-md-4">
                    {" "}
                    <i className={d.icon}></i>
                    <div className="service-desc">
                      <h3>{d.name}</h3>
                      <p>{d.text}</p>
                    </div>
                  </div>
                ))
              : "loading"}
          </div>
        </div>
      </div>
    </div>
  );
};

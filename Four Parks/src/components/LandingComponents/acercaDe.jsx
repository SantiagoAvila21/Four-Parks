import "../../styles/bootstrap.scss"
import "../../styles/style.scss"

/* eslint-disable react/prop-types */
export const About = (props) => {
  return (
    <div className="local-bootstrap">
      <div id="about">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-6">
              {" "}
              <img src="img/Parking1.jpeg" className="img-responsive" alt="" />{" "}
            </div>
            <div className="col-xs-12 col-md-6">
              <div className="about-text">
                <h2><strong>Acerca de Nosotros</strong></h2>
                <p>{props.data ? props.data.paragraph : "loading..."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

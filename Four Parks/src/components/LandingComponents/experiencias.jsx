import "../../styles/bootstrap.scss"
import "../../styles/style.scss"

/* eslint-disable react/prop-types */
export const Testimonials = (props) => {
  return (
    <div className="local-bootstrap">
      <div id="testimonials">
        <div className="container">
          <div className="section-title text-center">
            <h2><strong>EXPERIENCIAS DE NUESTROS CLIENTES</strong></h2>
          </div>
          <div className="row">
            {props.data
              ? props.data.map((d, i) => (
                  <div key={`${d.name}-${i}`} className="col-md-4">
                    <div className="testimonial">
                      <div className="testimonial-image">
                        {" "}
                        <img src={d.img} alt="" />{" "}
                      </div>
                      <div className="testimonial-content">
                        <p>{d.text}`</p>
                        <div className="testimonial-meta"> - {d.name} </div>
                      </div>
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

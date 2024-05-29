import "../../../css/bootstrap.scss"
import "../../../css/style.scss"
import logoFP from '../../assets/FourParksLogo.png';

export const Navigation = () => {
  return (
    <div className="local-bootstrap">
      <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      
        <div className="container">
          <div className="navbar-header">
          <img id="logoTop" src={logoFP} alt="Logo Four Parks" />
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              {" "}
              <span className="sr-only">Toggle navigation</span>{" "}
              <span className="icon-bar"></span>{" "}
              <span className="icon-bar"></span>{" "}
              <span className="icon-bar"></span>{" "}
            </button>
            
            <a className="navbar-brand page-scroll" href="#page-top">
              FOUR PARKS
            </a>{" "}
          </div>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#features" className="page-scroll">
                  Pasos
                </a>
              </li>
              <li>
                <a href="#about" className="page-scroll">
                  Acerca de nosotros
                </a>
              </li>
              <li>
                <a href="#services" className="page-scroll">
                  Ventajas
                </a>
              </li>
              <li>
                <a href="#testimonials" className="page-scroll">
                  Experiencias
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

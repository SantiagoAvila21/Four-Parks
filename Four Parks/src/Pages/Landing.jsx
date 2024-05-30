import { Navigation } from "../components/LandingComponents/navigation";
import { Header } from "../components/LandingComponents/header";
import { Features } from "../components/LandingComponents/pasos";
import { About } from "../components/LandingComponents/acercaDe";
import { Services } from "../components/LandingComponents/ventajas";
import { Testimonials } from "../components/LandingComponents/experiencias";
import JsonData from "../data/data.json";
import { Fade, Slide, JackInTheBox } from "react-awesome-reveal";


const Landing = () => {
  const landingPageData = JsonData;

  return (
    <div>
        <Navigation />
        <Fade triggerOnce>
          <Header data={landingPageData.Header} />
        </Fade>
        <Features data={landingPageData.Features} /> 
        <Slide triggerOnce>
          <About data={landingPageData.About} />
        </Slide>
        <Services data={landingPageData.Services} />
        <JackInTheBox triggerOnce>
          <Testimonials data={landingPageData.Testimonials} />
        </JackInTheBox>
    </div>
  );
};

export default Landing;

import { Navigation } from "../components/LandingComponents/navigation";
import { Header } from "../components/LandingComponents/header";
import { Features } from "../components/LandingComponents/pasos";
import { About } from "../components/LandingComponents/acercaDe";
import { Services } from "../components/LandingComponents/ventajas";
import { Testimonials } from "../components/LandingComponents/experiencias";
import JsonData from "../data/data.json";
//import { Fade, Slide, JackInTheBox } from "react-awesome-reveal";

const Landing = () => {
  const landingPageData = JsonData;

  return (
    <div>
        <Navigation />
        <Header data={landingPageData.Header} />
        <Features data={landingPageData.Features} /> 
        <About data={landingPageData.About} />
        <Services data={landingPageData.Services} />
        <Testimonials data={landingPageData.Testimonials} />
    </div>
  );
};

export default Landing;

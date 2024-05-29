import { Navigation } from "../components/LandingComponents/navigation";
import { Header } from "../components/LandingComponents/header";
import { Features } from "../components/LandingComponents/pasos";
import { About } from "../components/LandingComponents/acercaDe";
import { Services } from "../components/LandingComponents/services";
import { Testimonials } from "../components/LandingComponents/testimonials";
import { Team } from "../components/LandingComponents/footer";
import JsonData from "../data/data.json";

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

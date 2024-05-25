import { Navigation } from "../components/LandingComponents/navigation";
import { Header } from "../components/LandingComponents/header";
import { Features } from "../components/LandingComponents/features";
import { About } from "../components/LandingComponents/about";
import { Services } from "../components/LandingComponents/services";
import { Testimonials } from "../components/LandingComponents/testimonials";
import { Team } from "../components/LandingComponents/Team";
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
        <Team data={landingPageData.Team} />
    </div>
  );
};

export default Landing;

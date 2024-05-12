import TopBar from "../components/TopBar"
import Sidebar from "../components/Sidebar"
import MyMap from "../components/MyMap"
import '../styles/Home.css'
import { MarkerProvider } from "../Context/MarkerProvider"

const Home = () => {
  return (
    <div className="Home">
        <TopBar />
        <MarkerProvider>
          <div className='contentDiv'>
              <Sidebar />
              <MyMap />
          </div>
        </MarkerProvider>
    </div>
  )
}

export default Home
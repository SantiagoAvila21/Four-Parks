import TopBar from "../TopBar"
import Sidebar from "../Sidebar"
import MyMap from "../MyMap"
import '../styles/Home.css'
import { MarkerProvider } from "../../Context/MarkerProvider"

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
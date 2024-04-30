import TopBar from "./TopBar"
import Sidebar from "./Sidebar"
import MyMap from "./MyMap"
import './styles/Home.css'

const Home = () => {
  return (
    <div className="Home">
        <TopBar />
        <div className='contentDiv'>
            <Sidebar />
            <MyMap />
        </div>
    </div>
  )
}

export default Home
import { Map, Marker, Overlay } from "pigeon-maps";
import { useEffect, useState } from "react";
import MarkerInfo from "./MarkerInfo";
import '../styles/Markerinfo.css'
import { useMarkerContext } from "../Context/MarkerProvider";
import { useParking } from "../Context/ParkingsProvider";

function mapTiler(x, y, z, dpr) {
  return `https://api.maptiler.com/maps/${import.meta.env.VITE_MAP_ID}/256/${z}/${x}/${y}${
    dpr >= 2 ? "@2x" : ""
  }.png?key=${import.meta.env.VITE_MAPTILER_ACCESS_TOKEN}`;
}

const MyMap = () => {
  const parking = useParking();
  
  const [currentLocation, setCurrentLocation] = useState([0, 0]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState([0, 0]);
  const [selectedParking, setSelectedParking] = useState({});

  const { selectedMarkerPosition } = useMarkerContext();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const handleMarkerClick = (position, parqueaderoInfo) => {
    setSelectedParking({
      nombreParqueadero: parqueaderoInfo[2],
      direccion: parqueaderoInfo[3],
      tipo: parqueaderoInfo[1],
      espacioActual: parqueaderoInfo[5]
    });
    setOverlayPosition(position);
    setShowOverlay(true);
  };

  return (
    <Map
      provider = {mapTiler}
      dprs = {[1, 2]}
      center = {selectedMarkerPosition || currentLocation}
      defaultZoom = {17}
    >
      {parking.parqueaderos.map((parqueadero) => {
        return <Marker
          key={parqueadero[0]}
          onClick={() => handleMarkerClick([parqueadero[8], parqueadero[7]], parqueadero)}
          width={40}
          color={"#F96E08"}
          anchor={[parqueadero[8], parqueadero[7]]}
        />
      })}
      {showOverlay && (
        <Overlay anchor={overlayPosition} offset={[100, 0]}>
          <div onClick={() => setShowOverlay(false)} className="overlay">
            <MarkerInfo info={selectedParking}/> 
          </div>
        </Overlay>
      )}
    </Map>
  );
};

export default MyMap;

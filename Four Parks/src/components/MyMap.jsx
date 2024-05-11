import { Map, Marker, Overlay } from "pigeon-maps";
import { useEffect, useState } from "react";
import MarkerInfo from "./MarkerInfo";
import './styles/Markerinfo.css'
import { useMarkerContext } from "../Context/MarkerProvider";

function mapTiler(x, y, z, dpr) {
  return `https://api.maptiler.com/maps/${import.meta.env.VITE_MAP_ID}/256/${z}/${x}/${y}${
    dpr >= 2 ? "@2x" : ""
  }.png?key=${import.meta.env.VITE_MAPTILER_ACCESS_TOKEN}`;
}

const MyMap = () => {
  const [currentLocation, setCurrentLocation] = useState([0, 0]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState([0, 0]);

  const { selectedMarkerPosition } = useMarkerContext();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const handleMarkerClick = (position) => {
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
      <Marker
        onClick={() => handleMarkerClick([4.62958, -74.065738])}
        width={40}
        color={"#F96E08"}
        anchor={[4.62958, -74.065738]}
      />
      <Marker
        onClick={() => handleMarkerClick([4.60971, -74.08175])}
        width={40}
        color={"#F96E08"}
        anchor={[4.60971, -74.08175]} 
      />
      <Marker
        onClick={() => handleMarkerClick([4.648283, -74.077133])}
        width={40}
        color={"#F96E08"}
        anchor={[4.648283, -74.077133]} 
      />
      <Marker
        onClick={() => handleMarkerClick([4.63615, -74.06856])}
        width={40}
        color={"#F96E08"}
        anchor={[4.63615, -74.06856]} 
      />
      <Marker
        onClick={() => handleMarkerClick([4.60971, -74.06606])}
        width={40}
        color={"#F96E08"}
        anchor={[4.60971, -74.06606]} 
      />

      {showOverlay && (
        <Overlay anchor={overlayPosition} offset={[100, 0]}>
          <div onClick={() => setShowOverlay(false)} className="overlay">
            <MarkerInfo />
          </div>
        </Overlay>
      )}
    </Map>
  );
};

export default MyMap;

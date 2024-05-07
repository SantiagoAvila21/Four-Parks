import { Map, Marker } from "pigeon-maps"
import { useEffect, useState } from "react"

function mapTiler (x, y, z, dpr) {
  return `https://api.maptiler.com/maps/${import.meta.env.VITE_MAP_ID}/256/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png?key=${import.meta.env.VITE_MAPTILER_ACCESS_TOKEN}`
}

const MyMap = () => {
  const [currentLocation, setCurrentLocation] = useState([0, 0]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCurrentLocation([
        position.coords.latitude,
        position.coords.longitude
      ])
      console.log(position.coords.latitude, position.coords.longitude);
    });
  }, []);

  return (
    <Map
        provider={mapTiler}
        dprs={[1, 2]} // add this to support hidpi/retina (2x) maps if your provider supports them
        height={565}
        center={currentLocation}
        defaultZoom={17}
    >
        <Marker onClick = {() => {
          console.log("Clickeado paaa");
        }} 
          width={40} 
          color={'#F96E08'}
          anchor={[4.629580, -74.065738]} 
        />
        <Marker onClick={() => {
          console.log("¡Marcador clickeado!");
        }}
          width={40}
          color={'#F96E08'}
          anchor={[4.60971, -74.08175]} // Universidad Nacional de Colombia
        />
        <Marker onClick={() => {
          console.log("¡Marcador clickeado!");
        }}
          width={40}
          color={'#F96E08'}
          anchor={[4.648283, -74.077133]} // Parque El Virrey
        />

        <Marker onClick={() => {
          console.log("¡Marcador clickeado!");
        }}
          width={40}
          color={'#F96E08'}
          anchor={[4.63615, -74.06856]} // Parque Nacional Natural Chingaza
        />

        <Marker onClick={() => {
          console.log("¡Marcador clickeado!");
        }}
          width={40}
          color={'#F96E08'}
          anchor={[4.60971, -74.06606]} // Museo Botero
        />
    </Map>
  )
}

export default MyMap;

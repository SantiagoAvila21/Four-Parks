import { Map, Marker } from "pigeon-maps"

function mapTiler (x, y, z, dpr) {
  return `https://api.maptiler.com/maps/${import.meta.env.VITE_MAP_ID}/256/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png?key=${import.meta.env.VITE_MAPTILER_ACCESS_TOKEN}`
}

const MyMap = () => {
  return (
    <Map
        provider={mapTiler}
        dprs={[1, 2]} // add this to support hidpi/retina (2x) maps if your provider supports them
        height={565}
        defaultCenter={[4.629736, -74.066258]}
        defaultZoom={17}
    >
        <Marker onClick = {() => {
                console.log("Clickeado paaa");
            }} 
            width={40} 
            color={'#F96E08'}
            anchor={[4.629580, -74.065738]} 
        />
    </Map>
  )
}

export default MyMap;

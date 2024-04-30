import { Map, Marker } from "pigeon-maps"
import { osm } from 'pigeon-maps/providers'

const MyMap = () => {
  return (
    <Map
        provider={osm}
        dprs={[1, 2]} // add this to support hidpi/retina (2x) maps if your provider supports them
        height={500}
        defaultCenter={[4.629736, -74.066258]}
        defaultZoom={20}
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

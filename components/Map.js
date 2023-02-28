import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility'

export default function Map(props) {
  const [geoData, setGeoData] = useState({
    lat: props.positiveLat,
    lng: props.negativeLat,
  })

  const center = [geoData.lat, geoData.lng]

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100vh' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}>
        <Popup>{props.name}</Popup>
      </Marker>
    </MapContainer>
  )
}

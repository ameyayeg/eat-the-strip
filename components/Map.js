import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState } from 'react'
import Link from 'next/link'

export default function Map(props) {
  const position = [45.4215, -75.6972]
  const [arrCoordinates, setArrCoordinates] = useState(props.coordinates)

  console.log(arrCoordinates)

  const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png',
  })

  function MultipleMarkers() {
    return arrCoordinates.map((coordinata, index) => {
      return (
        <Marker key={index} position={coordinata.coordinates} icon={icon}>
          <Popup>
            {arrCoordinates.length > 1 && (
              <Link href={`/blog/${coordinata.slug}`}>{coordinata.name}</Link>
            )}
            {arrCoordinates.length === 1 && coordinata.name}
          </Popup>
        </Marker>
      )
    })
  }

  return (
    <MapContainer center={position} zoom={11} style={{ height: '60vh' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MultipleMarkers />
    </MapContainer>
  )
}

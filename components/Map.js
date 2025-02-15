import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState } from 'react'
import Link from 'next/link'

export default function Map(props) {
  const defaultProps = {
    coordinates: [],
    defaultZoom: 10,
    defaultCenter: [45.4215, -75.6972], // Ottawa coordinates
  }

  const { coordinates, defaultZoom, defaultCenter } = {
    ...defaultProps,
    ...props,
  }

  const [arrCoordinates, setArrCoordinates] = useState(coordinates)

  const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png',
  })

  // Calculate center and zoom based on number of markers
  const calculateMapBounds = () => {
    if (arrCoordinates.length === 0)
      return { center: defaultCenter, zoom: defaultZoom }
    if (arrCoordinates.length === 1) {
      return {
        center: arrCoordinates[0].coordinates,
        zoom: 17, // Closer zoom for single location
      }
    }

    const group = L.featureGroup(
      arrCoordinates.map((item) => L.marker(item.coordinates))
    )
    const bounds = group.getBounds()
    return {
      center: bounds.getCenter(),
      zoom: bounds.getZoom || defaultZoom,
    }
  }

  const { center, zoom } = calculateMapBounds()

  function MultipleMarkers() {
    return arrCoordinates.map((coordinate, index) => (
      <Marker key={index} position={coordinate.coordinates} icon={icon}>
        <Popup>
          {arrCoordinates.length > 1 ? (
            <Link href={`/blog/${coordinate.slug}`}>{coordinate.name}</Link>
          ) : (
            coordinate.name
          )}
        </Popup>
      </Marker>
    ))
  }

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '60vh' }}>
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MultipleMarkers />
    </MapContainer>
  )
}

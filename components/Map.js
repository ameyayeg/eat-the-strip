import { MapContainer, Marker, TileLayer, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Link from 'next/link'
import { useEffect } from 'react'

function FitBounds({ coordinates, defaultCenter, defaultZoom }) {
  const map = useMap()
  useEffect(() => {
    if (!coordinates.length) {
      map.setView(defaultCenter, defaultZoom)
    } else if (coordinates.length === 1) {
      map.setView(coordinates[0].coordinates, 17)
    } else {
      const bounds = L.latLngBounds(coordinates.map((item) => item.coordinates))
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
    // eslint-disable-next-line
  }, [coordinates, defaultCenter, defaultZoom])
  return null
}

export default function Map(props) {
  const defaultProps = {
    coordinates: [],
    defaultZoom: 10,
    defaultCenter: [45.4215, -75.6972],
  }

  const { coordinates, defaultZoom, defaultCenter } = {
    ...defaultProps,
    ...props,
  }

  const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png',
  })

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '60vh' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.map((coordinate, index) => (
        <Marker key={index} position={coordinate.coordinates} icon={icon}>
          <Popup>
            <Link href={`/blog/${coordinate.slug}`}>{coordinate.name}</Link>
          </Popup>
        </Marker>
      ))}
      <FitBounds
        coordinates={coordinates}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
      />
    </MapContainer>
  )
}

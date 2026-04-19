"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const techIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const custIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function RoutingControl({ from, to }: { from: [number, number]; to: [number, number] }) {
  const map = useMap()
  const routingRef = useRef<any>(null)

  useEffect(() => {
    if (!map) return

    if (routingRef.current) {
      try {
        routingRef.current.getPlan().setWaypoints([])
        map.removeControl(routingRef.current)
        routingRef.current = null
      } catch (err) {
        console.log("Pre-cleanup:", err)
      }
    }

    const init = async () => {
      try {
        await import("leaflet-routing-machine")

        routingRef.current = (L as any).Routing.control({
          waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
          routeWhileDragging: false,
          show: false,
          router: (L as any).Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
            profile: "driving",
          }),
          lineOptions: {
            styles: [{ color: "#3b82f6", weight: 4 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
          createMarker: () => null,
        })

        routingRef.current.addTo(map)
      } catch (err) {
        console.log("Routing error:", err)
      }
    }

    init()

    return () => {
      try {
        if (routingRef.current) {
          routingRef.current.getPlan().setWaypoints([])
          map.removeControl(routingRef.current)
          routingRef.current = null
        }
      } catch (err) {
        console.log("Cleanup:", err)
      }
    }
  }, [map, from[0], from[1], to[0], to[1]])

  return null
}

interface MapWithRouteProps {
  techLocation: [number, number]
  custLocation: [number, number]
  techName: string
}

export default function MapWithRoute({ techLocation, custLocation, techName }: MapWithRouteProps) {
  return (
    <MapContainer
      key={`${techLocation[0]}-${techLocation[1]}-${custLocation[0]}-${custLocation[1]}`}
      center={custLocation}
      zoom={14}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      <Marker position={techLocation} icon={techIcon}>
        <Popup>🔧 {techName}</Popup>
      </Marker>

      <Marker position={custLocation} icon={custIcon}>
        <Popup>🏠 Your location</Popup>
      </Marker>

      <RoutingControl from={techLocation} to={custLocation} />
    </MapContainer>
  )
}

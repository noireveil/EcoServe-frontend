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

function RoutingControl({
  from,
  to,
  onInstructions,
}: {
  from: [number, number]
  to: [number, number]
  onInstructions?: (steps: string[]) => void
}) {
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
          waypoints: [
            L.latLng(from[0], from[1]),
            L.latLng(to[0], to[1]),
          ],
          routeWhileDragging: false,
          show: false,
          router: (L as any).Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
            profile: "driving",
          }),
          lineOptions: {
            styles: [{ color: "#10b981", weight: 4 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
          createMarker: () => null,
        })

        routingRef.current.on("routesfound", (e: any) => {
          const route = e.routes[0]
          const steps = route.instructions.map((i: any) => i.text)
          onInstructions?.(steps)
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

interface MapWithRoutingProps {
  userLocation: [number, number]
  targetLat: number | null
  targetLng: number | null
  nearbyOrders: any[]
  onInstructions?: (steps: string[]) => void
}

export default function MapWithRouting({
  userLocation,
  targetLat,
  targetLng,
  nearbyOrders,
  onInstructions,
}: MapWithRoutingProps) {
  const center: [number, number] = targetLat && targetLng
    ? [targetLat, targetLng]
    : userLocation

  return (
    <MapContainer
      key={`${targetLat}-${targetLng}-${userLocation[0]}-${userLocation[1]}`}
      center={center}
      zoom={14}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      <Marker position={userLocation}>
        <Popup>Your location</Popup>
      </Marker>

      {targetLat && targetLng && (
        <>
          <Marker position={[targetLat, targetLng]}>
            <Popup>Customer location</Popup>
          </Marker>
          <RoutingControl
            from={userLocation}
            to={[targetLat, targetLng]}
            onInstructions={onInstructions}
          />
        </>
      )}

      {!targetLat && nearbyOrders.map((order) =>
        order.CustomerLatitude && order.CustomerLongitude ? (
          <Marker
            key={order.ID}
            position={[order.CustomerLatitude, order.CustomerLongitude]}
          >
            <Popup>
              <p>{order.DeviceCategory}</p>
              <p>{order.Customer?.FullName}</p>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  )
}

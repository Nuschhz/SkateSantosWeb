"use client";

import { useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapProps } from "@/src/types";

const fixLeafletIcon = () => {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

const MAPTILER_KEY =
  process.env.NEXT_PUBLIC_MAPTILER_KEY || "SnNQIJXsQtdvG6l3YOcD";
const mapTilesURL = `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
const mapAttribution =
  '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
  zIndex: 0,
};

const centerDefault: L.LatLngExpression = [-23.9618, -46.3322];

function MapClickHandler({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(event) {
      onClick(event.latlng);
    },
  });
  return null;
}

export default function MapComponent({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  stations,
}: MapProps) {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      setLatitude(latlng.lat);
      setLongitude(latlng.lng);
    },
    [setLatitude, setLongitude]
  );

  return (
    <MapContainer
      center={centerDefault}
      zoom={13}
      style={containerStyle}
      scrollWheelZoom={true}
    >
      <TileLayer attribution={mapAttribution} url={mapTilesURL} />

      <MapClickHandler onClick={handleMapClick} />

      {latitude && longitude && latitude !== 0 && longitude !== 0 && (
        <Marker
          position={[latitude, longitude]}
          opacity={0.8}
          eventHandlers={{
            click: () => {},
          }}
        />
      )}

      {stations.map((station, index) => (
        <Marker
          key={index}
          position={[station.latitude, station.longitude]}
          title={`Estação ${index + 1}`}
        />
      ))}
    </MapContainer>
  );
}

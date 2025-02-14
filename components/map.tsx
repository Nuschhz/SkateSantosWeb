"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { MapProps } from "@/src/types";

const containerStyle = {
  width: "800px",
  height: "450px",
  borderRadius: "4px",
  overflow: "hidden",
};

const centerDefault = { lat: -23.9618, lng: -46.3322 };

export default function MapComponent({
  isLoaded,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  stations,
}: MapProps) {
  const [mapCenter] = useState(centerDefault);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setLatitude(lat);
        setLongitude(lng);
      }
    },
    [setLatitude, setLongitude]
  );

  if (!isLoaded) {
    return <div>Carregando mapa...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={12}
      onClick={handleMapClick}
    >
      {latitude && longitude && (
        <Marker position={{ lat: latitude, lng: longitude }} />
      )}
      {stations.map((station, index) => (
        <Marker
          key={index}
          position={{ lat: station.latitude, lng: station.longitude }}
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />
      ))}
    </GoogleMap>
  );
}

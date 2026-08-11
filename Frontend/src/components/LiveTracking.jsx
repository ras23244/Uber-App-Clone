



import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

// User icon
const userIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Captain icon
const captainIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Pickup icon
const pickupIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Destination icon
const destinationIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const InitialViewport = ({ pickupCoords, destinationCoords }) => {
  const map = useMap();
  const hasFittedInitialRoute = useRef(false);

  useEffect(() => {
    if (hasFittedInitialRoute.current) return;

    const bounds = [pickupCoords, destinationCoords]
      .filter(Boolean)
      .map((coords) => [coords.lat, coords.lng]);

    if (bounds.length >= 2) {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15
      });
      hasFittedInitialRoute.current = true;
    }
  }, [destinationCoords, map, pickupCoords]);

  return null;
};

const AnimatedCaptainMarker = ({ captainCoords }) => {
  const markerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const initialPositionRef = useRef([
    captainCoords.lat,
    captainCoords.lng
  ]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return undefined;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const start = marker.getLatLng();
    const target = {
      lat: captainCoords.lat,
      lng: captainCoords.lng
    };
    const startedAt = performance.now();
    const duration = 800;

    const animate = (timestamp) => {
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const easedProgress = progress * (2 - progress);
      const latitude = start.lat + (target.lat - start.lat) * easedProgress;
      const longitude = start.lng + (target.lng - start.lng) * easedProgress;

      marker.setLatLng([latitude, longitude]);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
        console.log('[gps] captain marker updated:', target);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [captainCoords]);

  return (
    <Marker
      ref={markerRef}
      position={initialPositionRef.current}
      icon={captainIcon}
    >
      <Popup>
        <strong>Captain</strong>
      </Popup>
    </Marker>
  );
};

const LiveTracking = ({
  pickupCoords,
  destinationCoords,
  captainCoords,
  routeCoords
}) => {
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    const updatePosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        (error) => {
          console.error('Error fetching location:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000
        }
      );
    };

    updatePosition();

    const interval = setInterval(updatePosition, 10000);

    return () => clearInterval(interval);
  }, []);

  const center = currentPosition || [28.6139, 77.209];

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        zoomControl={true}
        attributionControl={true}
        style={{
          height: '100%',
          width: '100%',
          zIndex: 0
        }}
      >
        <InitialViewport
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
        />

        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={userIcon}
          >
            <Popup>
              <strong>Your location</strong>
            </Popup>
          </Marker>
        )}

        {captainCoords && (
          <AnimatedCaptainMarker captainCoords={captainCoords} />
        )}

        {pickupCoords && (
          <Marker
            position={[
              pickupCoords.lat,
              pickupCoords.lng
            ]}
            icon={pickupIcon}
          >
            <Popup>
              <strong>Pickup</strong>
            </Popup>
          </Marker>
        )}

        {destinationCoords && (
          <Marker
            position={[
              destinationCoords.lat,
              destinationCoords.lng
            ]}
            icon={destinationIcon}
          >
            <Popup>
              <strong>Destination</strong>
            </Popup>
          </Marker>
        )}

        {routeCoords && routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#2563eb',
              weight: 5,
              opacity: 0.8
            }}
          />
        )}

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default LiveTracking;
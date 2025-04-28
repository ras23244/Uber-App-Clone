import React, { useState, useEffect, useRef } from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';

const libraries = ['marker'];

const containerStyle = {
  width: '100%',
  height: '100%' 
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setCurrentPosition(newPos);
          },
          (error) => console.error('Error fetching location:', error),
          { enableHighAccuracy: true }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("this is current position", currentPosition);
    if (markerRef.current && currentPosition) {
      markerRef.current.position = currentPosition;
    }
  }, [currentPosition]);

  const onLoad = async (map) => {
    mapRef.current = map;

    if (!currentPosition) return;

    const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');

    const marker = new AdvancedMarkerElement({
      map,
      position: currentPosition,
      title: 'You are here',
    });

    markerRef.current = marker;
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      {currentPosition && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition}
          zoom={15}
          onLoad={onLoad}
          options={{ mapId: 'DEMO_MAP_ID' }}
        />
      )}
    </LoadScript>
  );
};

export default LiveTracking;

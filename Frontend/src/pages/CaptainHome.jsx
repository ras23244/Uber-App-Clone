

// export default CaptainHome
import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopup from '../components/ConfirmRidePopup';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CaptainContext';
import LiveTracking from '../components/LiveTracking';

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);

  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const confirmRidePopupPanelRef = useRef(null);

  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  // Register before joining so a fast ride request cannot race the listener.
  useEffect(() => {
    const captainId = captain?._id;
    if (!socket || !captainId) return;

    const onNewRide = (data) => {
      console.log('[socket] new-ride received:', data?._id);
      setRide(data);
      setRidePopupPanel(true);
      console.log('[captain] RidePopUp opened:', data?._id);
    };

    const joinCaptain = () => {
      console.log('[socket] joining captain room:', captainId);
      socket.emit('join', {
        type: 'captain',
        userId: captainId
      }, (response) => {
        console.log('[socket] captain join acknowledged:', response);
      });
    };

    socket.on('new-ride', onNewRide);
    socket.on('connect', joinCaptain);

    if (socket.connected) {
      joinCaptain();
    }

    return () => {
      socket.off('new-ride', onNewRide);
      socket.off('connect', joinCaptain);
    };
  }, [socket, captain?._id]);

  // Send captain's location to backend
  useEffect(() => {
    if (!socket || !captain?._id) return;

    if (!navigator.geolocation) {
      console.error('[gps] geolocation is not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        console.log('[gps] sending captain location:', location);
        socket.emit('update-location-captain', {
          userId: captain._id,
          location
        });
      },
      (error) => {
        console.error('[gps] captain location error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      console.log('[gps] captain location watcher stopped');
    };
  }, [socket, captain?._id]);

  const confirmRide = async (rideId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId,
          captainId: captain._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setRide(response.data.ride);
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error('Error confirming ride:', error);
    }
  };

  // Ride popup animation
  useGSAP(
    () => {
      if (!ridePopupPanelRef.current) return;

      gsap.to(ridePopupPanelRef.current, {
        y: ridePopupPanel ? 0 : '100%',
        duration: 0.35,
        ease: 'power3.out'
      });
    },
    [ridePopupPanel]
  );

  // Confirm ride popup animation
  useGSAP(
    () => {
      if (!confirmRidePopupPanelRef.current) return;

      gsap.to(confirmRidePopupPanelRef.current, {
        y: confirmRidePopupPanel ? 0 : '100%',
        duration: 0.35,
        ease: 'power3.out'
      });
    },
    [confirmRidePopupPanel]
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100">

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
            <i className="ri-steering-2-fill text-xl text-green-600"></i>
            <span className="font-semibold">Captain</span>
          </div>
        </div>

        <Link
          to="/captain/logout"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition active:scale-95"
        >
          <i className="ri-logout-box-r-line text-lg"></i>
        </Link>
      </div>

      {/* Full-screen map */}
      <div className="absolute inset-0 z-0">
        <LiveTracking />
      </div>

      {/* Captain details */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl bg-white p-4 shadow-2xl">
          <CaptainDetails />
        </div>
      </div>

      {/* New ride popup */}
      <div
        ref={ridePopupPanelRef}
        className="fixed bottom-0 left-0 right-0 z-[200] translate-y-full pointer-events-none"
      >
        <div className="pointer-events-auto max-h-[75vh] overflow-y-auto rounded-t-3xl bg-white px-4 pb-8 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.18)]">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300"></div>

          <RidePopUp
            ride={ride}
            setRidePopupPanel={setRidePopupPanel}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            confirmRide={confirmRide}
          />
        </div>
      </div>

      {/* Confirm ride popup */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed inset-0 z-[210] translate-y-full pointer-events-none"
      >
        <div className="pointer-events-auto flex h-full flex-col overflow-y-auto bg-white px-4 pb-8 pt-4">
          <div className="mx-auto mb-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"></div>

          <ConfirmRidePopup
            ride={ride}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            setRidePopupPanel={setRidePopupPanel}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
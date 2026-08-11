
import React, { useRef, useState, useEffect, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'

import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmedRide from '../components/ConfirmedRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'

import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'


const Home = () => {

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')

  const [panelOpen, setPanelOpen] = useState(false)

  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])

  const [isPickup, setIsPickup] = useState(true)

  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)

  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false)
  const vehiclePanelRef = useRef(null)

  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const confirmRidePanelRef = useRef(null)

  const [vehicleFound, setVehicleFound] = useState(false)
  const vehicleFoundRef = useRef(null)

  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const waitingForDriverRef = useRef(null)

  const [fare, setFare] = useState({})
  const [duration, setDuration] = useState('')

  const [vehicleType, setVehicleType] = useState(null)

  const [isConfirmRidebuttonClicked, setIsConfirmRidebuttonClicked] = useState(false)

  const [ride, setRide] = useState(null)

  const [pickupCoords, setPickupCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)
  const [captainCoords, setCaptainCoords] = useState(null)

  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)


  // Join user socket room
  useEffect(() => {

    if (!socket || !user?._id) return

    socket.emit('join', {
      type: "user",
      userId: user._id
    })

  }, [socket, user])


  // Socket listeners
  useEffect(() => {

    if (!socket) return

    const onRideConfirmed = (ride) => {

      setRide(ride)

      setWaitingForDriver(true)

      setVehicleFound(false)

      setConfirmRidePanel(false)

    }


    const onRideStarted = (ride) => {

      setWaitingForDriver(false)

      navigate('/riding', {
        state: {
          ride
        }
      })

    }

    const onRideEnded = () => {
      setCaptainCoords(null)
      setWaitingForDriver(false)
      setRide(null)
    }

    const onCaptainLocationUpdate = (coords) => {
      setCaptainCoords(coords)
    }


    socket.on('ride-confirmed', onRideConfirmed)

    socket.on('ride-started', onRideStarted)

    socket.on('ride-ended', onRideEnded)

    socket.on('captain-location-update', onCaptainLocationUpdate)


    return () => {

      socket.off('ride-confirmed', onRideConfirmed)

      socket.off('ride-started', onRideStarted)

      socket.off('ride-ended', onRideEnded)

      socket.off('captain-location-update', onCaptainLocationUpdate)

    }

  }, [socket, navigate])


  // Fetch location suggestions
  const fetchSuggestions = async (input, setSuggestions) => {

    try {

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestion?input=${encodeURIComponent(input)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      setSuggestions(response.data)

    } catch (error) {

      console.error('Error fetching suggestions:', error)

      setSuggestions([])

    }

  }


  // Pickup suggestions
  useEffect(() => {

    if (pickup.length < 3) {

      setPickupSuggestions([])

      return

    }

    const timer = setTimeout(
      () => fetchSuggestions(pickup, setPickupSuggestions),
      400
    )

    return () => clearTimeout(timer)

  }, [pickup])


  // Destination suggestions
  useEffect(() => {

    if (destination.length < 3) {

      setDestinationSuggestions([])

      return

    }

    const timer = setTimeout(
      () => fetchSuggestions(destination, setDestinationSuggestions),
      400
    )

    return () => clearTimeout(timer)

  }, [destination])


  const submitHandler = (e) => {
    e.preventDefault()
  }


  // Location search panel animation
  useGSAP(() => {

    if (!panelRef.current) return

    if (panelOpen) {

      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24,
        duration: 0.3
      })

      gsap.to(panelCloseRef.current, {
        opacity: 1,
        duration: 0.2
      })

    } else {

      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0,
        duration: 0.3
      })

      gsap.to(panelCloseRef.current, {
        opacity: 0,
        duration: 0.2
      })

    }

  }, [panelOpen])


  // Vehicle panel animation
  useGSAP(() => {

    if (!vehiclePanelRef.current) return

    gsap.to(vehiclePanelRef.current, {

      y: vehiclePanelOpen ? '0%' : '100%',

      duration: 0.35,

      ease: 'power2.out'

    })

  }, [vehiclePanelOpen])


  // Confirmation panel animation
  useGSAP(() => {

    if (!confirmRidePanelRef.current) return

    if (confirmRidePanel) {

      // Make sure it is visible
      gsap.set(confirmRidePanelRef.current, {
        display: 'block',
        visibility: 'visible'
      })

      gsap.to(confirmRidePanelRef.current, {

        y: '0%',

        duration: 0.35,

        ease: 'power2.out'

      })

    } else {

      gsap.to(confirmRidePanelRef.current, {

        y: '100%',

        duration: 0.35,

        ease: 'power2.in',

        onComplete: () => {

          if (confirmRidePanelRef.current) {

            gsap.set(confirmRidePanelRef.current, {
              display: 'block'
            })

          }

        }

      })

    }

  }, [confirmRidePanel])


  // Looking for driver panel
  useGSAP(() => {

    if (!vehicleFoundRef.current) return

    gsap.to(vehicleFoundRef.current, {

      y: vehicleFound && isConfirmRidebuttonClicked
        ? '0%'
        : '100%',

      duration: 0.35,

      ease: 'power2.out'

    })

  }, [vehicleFound, isConfirmRidebuttonClicked])


  // Waiting for driver panel
  useGSAP(() => {

    if (!waitingForDriverRef.current) return

    gsap.to(waitingForDriverRef.current, {

      y: waitingForDriver
        ? '0%'
        : '100%',

      duration: 0.35,

      ease: 'power2.out'

    })

  }, [waitingForDriver])


  // Find trip
  async function findTrip() {

    if (!pickup || !destination) {

      console.error('Pickup and destination are required')

      return

    }


    setPanelOpen(false)

    setConfirmRidePanel(false)

    setVehiclePanelOpen(true)


    try {

      // Get fare
      const fareResponse = await axios.get(

        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,

        {
          params: {
            pickup,
            destination
          },

          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }

      )

      setFare(fareResponse.data)


      // Get route duration
      const distanceTimeResponse = await axios.get(

        `${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`,

        {
          params: {
            origin: pickup,
            destination: destination
          },

          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }

      )

      setDuration(
        distanceTimeResponse.data?.duration?.text || ''
      )


    } catch (error) {

      console.error(
        'Error getting fare/time:',
        error
      )

      setDuration('')

    }

  }


  // Create ride
  async function createRide() {

    try {

      const response = await axios.post(

        `${import.meta.env.VITE_BASE_URL}/rides/create`,

        {
          pickup,
          destination,
          vehicleType
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }

      )


      return response.data

    } catch (error) {

      console.error(
        'Error creating ride:',
        error
      )

      throw error

    }

  }


  return (

    <div className="h-screen relative overflow-hidden">

      {/* Uber logo */}
      <img
        className="w-16 absolute left-5 top-5 z-30"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber"
      />


      {/* Map */}
      <div className="absolute inset-0 z-0">

        <LiveTracking
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          captainCoords={captainCoords}
        />

      </div>


      {/* Main search area */}
      <div className="h-screen flex flex-col justify-end top-0 absolute w-full z-20 pointer-events-none">

        <div className="h-[30%] p-6 bg-white relative pointer-events-auto">

          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 top-6 right-6 text-3xl cursor-pointer"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>


          <h4 className="text-2xl font-semibold mt-5">
            Find a trip
          </h4>


          <form
            onSubmit={(e) => submitHandler(e)}
          >

            <div className="line absolute h-16 w-1 top-[45%] left-12 bg-gray-800 rounded-full"></div>


            {/* Pickup */}
            <input
              onClick={() => {

                setPanelOpen(true)
                setIsPickup(true)

              }}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="bg-[#eee] w-full pl-12 p-4 text-lg rounded-lg mt-2"
              type="text"
              name="pickup"
              placeholder="Add a pick-up location"
            />


            {/* Destination */}
            <input
              onClick={() => {

                setPanelOpen(true)
                setIsPickup(false)

              }}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-[#eee] w-full pl-12 p-4 text-lg rounded-lg mt-2"
              type="text"
              name="destination"
              placeholder="Enter your destination"
            />

          </form>


          <button
            onClick={findTrip}
            className="w-full mt-4 bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300"
          >
            Find Trip
          </button>

        </div>


        {/* Search suggestions */}
        <div
          ref={panelRef}
          className="bg-white h-0 pointer-events-auto overflow-hidden"
        >

          <LocationSearchPanel

            setPanelOpen={setPanelOpen}

            setVehiclePanelOpen={setVehiclePanelOpen}

            suggestions={
              isPickup
                ? pickupSuggestions
                : destinationSuggestions
            }

            setPickup={setPickup}

            setDestination={setDestination}

            setPickupCoords={setPickupCoords}

            setDestinationCoords={setDestinationCoords}

            isPickup={isPickup}

          />

        </div>

      </div>


      {/* Vehicle panel */}
      <div
        ref={vehiclePanelRef}
        className="
                    fixed
                    w-full
                    max-h-[70vh]
                    overflow-hidden
                    z-40
                    bottom-0
                    translate-y-full
                    px-3
                    py-6
                    bg-white
                    rounded-t-3xl
                    shadow-2xl
                "
      >

        <VehiclePanel

          setVehicle={setVehicleType}

          fare={fare}

          duration={duration}

          setConfirmRidePanel={setConfirmRidePanel}

          setVehiclePanelOpen={setVehiclePanelOpen}

        />

      </div>


      {/* Confirm ride panel */}
      <div
        ref={confirmRidePanelRef}
        className="
                    fixed
                    w-full
                    max-h-[85vh]
                    overflow-y-auto
                    z-50
                    bottom-0
                    translate-y-full
                    px-4
                    py-6
                    bg-white
                    rounded-t-3xl
                    shadow-2xl
                "
      >

        <ConfirmedRide

          createRide={createRide}

          pickup={pickup}

          destination={destination}

          fare={fare}

          vehicleType={vehicleType}

          setIsConfirmRidebuttonClicked={
            setIsConfirmRidebuttonClicked
          }

          setConfirmRidePanel={
            setConfirmRidePanel
          }

          setVehicleFound={
            setVehicleFound
          }

        />

      </div>


      {/* Looking for driver */}
      <div
        ref={vehicleFoundRef}
        className="
                    fixed
                    w-full
                    max-h-[85vh]
                    overflow-y-auto
                    z-40
                    bottom-0
                    translate-y-full
                    px-4
                    py-6
                    bg-white
                    rounded-t-3xl
                    shadow-2xl
                "
      >

        <LookingForDriver

          pickup={pickup}

          destination={destination}

          fare={fare}

          vehicleType={vehicleType}

          setVehicleFound={setVehicleFound}

        />

      </div>


      {/* Waiting for driver */}
      <div
        ref={waitingForDriverRef}
        className="
                    fixed
                    w-full
                    max-h-[85vh]
                    overflow-y-auto
                    z-40
                    bottom-0
                    translate-y-full
                    px-4
                    py-6
                    bg-white
                    rounded-t-3xl
                    shadow-2xl
                "
      >

        <WaitingForDriver

          ride={ride}

          setWaitingForDriver={
            setWaitingForDriver
          }

        />

      </div>

    </div>

  )

}

export default Home
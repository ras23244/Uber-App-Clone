import React, { useRef, useState, useEffect } from 'react'
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
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
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
  const [vehicleType, setVehicleType] = useState(null)
  const [isConfirmRidebuttonClicked, setIsConfirmRidebuttonClicked] = useState(false)
  const [ride, setRide] = useState(null)

  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext) 

  useEffect(()=>{
    socket.emit('join', { type: "user", userId: user._id })
  },[ user ])

  socket.on('ride-confirmed',(ride)=>{
   
    setRide(ride)
    setWaitingForDriver(true)
    setVehicleFound(false)
  })

  socket.on('ride-started',(ride)=>{
    setWaitingForDriver(false)
    navigate('/riding',{state:{ride}})
  })


  const fetchSuggestions = async (input) => {
    try { 
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestion?input=${input}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setSuggestions(response.data)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  useEffect(() => {
    if (pickup.length >= 3) {
      fetchSuggestions(pickup)
    }
  }, [pickup])

  useEffect(() => {
    if (destination.length >= 3) {
      fetchSuggestions(destination)
    }
  }, [destination])

  const submitHandler = (e) => {
    e.preventDefault()
  }

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1
      })
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])

  useGSAP(() => {
    if (vehiclePanelOpen) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehiclePanelOpen])

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        display: 'block',
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePanel])

  useGSAP(() => {
    if (vehicleFound && isConfirmRidebuttonClicked) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehicleFound])

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [waitingForDriver])

  async function findTrip() {
    setVehiclePanelOpen(true)
    setPanelOpen(false)

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: { pickup, destination },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = response.data
    setFare(data)
  }

  async function createRide(){
    const response =await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`,{
      pickup,
      destination,
      vehicleType,
    },{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const ride= response.data
    console.log(ride)
  }

  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-16 absolute left-5 top-5 z-2' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
      <div className='h-screen w-screen '>
        <LiveTracking />
      </div>

      <div className='h-screen flex flex-col justify-end top-0 absolute w-full '>
        <div className='h-[30%]  p-6 bg-white relative'>
          <h5 ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false)
            }} className='absolute opacity-0 top-6 right-6 text-3xl'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-2xl font-semibold mt-5'>Find a trip</h4>
          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            <div className='line absolute h-16 w-1 top-[45%] left-12 bg-gray-800 rounded-full'></div>
            <input
              onClick={() => {
                setPanelOpen(true)
                setIsPickup(true)
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value)
              }}
              className='bg-[#eee] w-full pl-12 p-4 text-lg rounded-lg mt-2'
              type="text"
              name="pickup"
              placeholder='Add a pick-up location' />

            <input
              onClick={() => {
                setPanelOpen(true)
                setIsPickup(false)
              }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value)
              }}
              className='bg-[#eee] w-full pl-12 p-4 text-lg rounded-lg mt-2'
              type="text"
              name="destination"
              placeholder='Enter your destination' />
          </form>
          <button onClick={findTrip} className="w-full mt-4 bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300">
            Find Trip
          </button>
        </div>

        <div ref={panelRef} className='bg-white h-0 '>
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanelOpen={setVehiclePanelOpen}
            suggestions={suggestions}
            setPickup={setPickup}
            setDestination={setDestination}
            isPickup={isPickup}
          />
        </div>
      </div>
      <div ref={vehiclePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 bg-white pt-12">
        <VehiclePanel
          setVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>

      <div ref={confirmRidePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-6 bg-white pt-12 hidden ">
        <ConfirmedRide 
        createRide={createRide}
        pickup={pickup}
        destination={destination}
        fare={fare}
        vehicleType={vehicleType}
        
        setIsConfirmRidebuttonClicked={setIsConfirmRidebuttonClicked}
        setConfirmRidePanel={setConfirmRidePanel} 
        setVehicleFound={setVehicleFound} />
      </div>

      <div ref={vehicleFoundRef} className="fixed w-full bottom-0 translate-y-full px-3 py-6 bg-white pt-12 ">
        <LookingForDriver 
        pickup={pickup}
        destination={destination}
        fare={fare}
        vehicleType={vehicleType}
        setVehicleFound={setVehicleFound} />
      </div>

      <div ref={waitingForDriverRef} className="fixed w-full z-10 bottom-0 px-3 py-6 bg-white pt-12">
        <WaitingForDriver 
        ride={ride}
        setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  )
}

export default Home

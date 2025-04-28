import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Riding = (props) => {
    const location = useLocation()  
    const ride = location.state?.ride
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    socket.on('ride-ended',(ride)=>{
       
        navigate('/home')
    })

    return (
        <div className='h-screen'>
            <Link to={'/home'} className='flex right-2 top-2 items-center justify-center fixed h-10 w-10 bg-amber-500 rounded-full'>
                <i className="text-2xl ri-home-4-line"></i>
            </Link>

            <div className="h-1/2">
            <LiveTracking />
            </div>

            <div className="h-1/2 p-3 -mt-4">
                <div className='flex justify-between items-center'>
                    <img className='h-19' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
                    <div className='text-right '>
                        <h2 className='text-sm font-medium capitalize'>{ride?.captain.fullname.firstname} {ride?.captain.fullname.lastname}</h2>
                        <h4 className='text-lg font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm text-gray-600'>{ride?.captain.vehicle.vehicleType}</p>
                    </div>
                </div>

                <div className='flex flex-col justify-between items-center gap-5'>
                    <div className='w-full mt-3'>
                        <div className="flex items-center gap-2 p-3 border-b-1 border-gray-300">
                            <i className="text-2xl ri-map-pin-2-line"></i>
                            <div className='px-4'>
                                <h3 className='font-bold'>Destination</h3>
                                <p className=' text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 ">
                            <i className="text-2xl ri-currency-line"></i>
                            <div className='px-4'>
                                <h3 className='font-bold '>₹{ride?.fare}</h3>
                                <p className=' text-gray-600'>Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='w-full bg-green-600 text-white font-semibold text-lg rounded p-2 mb-5'>Make a Payment</button>
            </div>
        </div>
    )
}

export default Riding

import React,{ useState, useContext } from 'react'
import { Link, } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopup = (props) => {
    const { captain } = useContext(CaptainDataContext)
    const navigate = useNavigate()

    const [otp, setOtp] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
                {
                    params: {
                        rideId: props.ride._id,
                        otp: otp
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
    
            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
                navigate('/captain-riding', { state: { ride: props.ride } }); // Pass ride data
            }
        } catch (error) {
            console.error('Error starting ride:', error);
            // You can also add user feedback here if needed
        }
    };
    
    return (
        <div>
            <h5 onClick={() => {
                props.setConfirmRidePopupPanel(false)
            }}
                className='p-1 text-center w-[93%] absolute top-0 '><i className="text-3xl text-gray-500 ri-arrow-down-wide-fill"></i></h5>
            <h3 className='text-xl font-semibold '>Confirm your Ride!</h3>

            <div className="flex items-start justify-between mt-4 mb-5 border-2 border-yellow-400 p-3 rounded-lg">
                <div className="flex items-start gap-3">
                    <img className='h-12 w-12 object-cover rounded-full' src="https://www.allprodad.com/wp-content/uploads/2021/03/05-12-21-happy-people.jpg" alt="" />
                    <h2 className='text-xl font-semibold capitalize'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>

                </div>
                <h5 className='text-xl font-semibold'>{props.ride?.distance || 'N/A'} KM</h5>
            </div>

            <div className='flex flex-col justify-between items-center gap-2'>
                <div className='w-full'>
                    <div className='flex items-center gap-2 p-3 border-b-1 border-gray-300'>
                        <i className="text-2xl ri-map-pin-range-fill"></i>
                        <div className='px-4'>
                            <h3 className='font-bold '>Pickup</h3>
                            <p className=' text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 border-b-1 border-gray-300">
                        <i className="text-2xl ri-map-pin-2-line"></i>
                        <div className='px-4'>
                            <h3 className='font-bold '>Destination</h3>
                            <p className=' text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 ">
                        <i className="text-2xl ri-currency-line"></i>
                        <div className='px-4'>
                            <h3 className='font-bold'>₹{props.ride?.fare}</h3>
                            <p className=' text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>


                <div className="mt-6">
                    <form onSubmit={(e)=>{
                        submitHandler(e)
                    }}>

                        <input value={otp} onChange={(e)=>{
                            setOtp(e.target.value)
                        }} className='bg-[#eee] w-full px-6 py-3 text-lg rounded-lg mt-2' type="text" name="otp" id="" placeholder='Enter OTP' />
                        
                        <button onClick={() => {
                            props.setConfirmRidePopupPanel(false)
                        }} className='w-full mt-5 bg-gray-300 text-red-700 font-semibold text-xl rounded p-2'>Cancel</button>

                        <button  className='w-full flex justify-center items-center mt-1 bg-green-600 text-white font-semibold text-xl rounded p-2'>Confirm</button>

                    </form>
                </div>

            </div>

        </div>
    )
}

export default ConfirmRidePopup

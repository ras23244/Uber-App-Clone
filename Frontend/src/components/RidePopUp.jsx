import React from 'react'

const RidePopUp = (props) => {
    return (
        <div>
            <h5 onClick={() => props.setRidePopupPanel(false)} className='p-1 text-center w-[93%] absolute top-0'>
                <i className="text-3xl text-gray-500 ri-arrow-down-wide-fill"></i>
            </h5>
            <h3 className='text-xl font-semibold'>New Ride Available!</h3>

            <div className="flex items-start justify-between mt-4 mb-5 bg-yellow-400 p-3 rounded-lg">
                <div className="flex items-start gap-3">
                    <img className='h-12 w-12 object-cover rounded-full' src="https://www.allprodad.com/wp-content/uploads/2021/03/05-12-21-happy-people.jpg" alt="" />
                    <h2 className='text-xl font-semibold'>{props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}</h2>
                </div>
                <h5 className='text-xl font-semibold'>{props.ride?.distance || 'N/A'} KM</h5>
            </div>

            <div className='flex flex-col justify-between items-center gap-2'>
                <div className='w-full'>
                    <div className='flex items-center gap-2 p-3 border-b-1 border-gray-300'>
                        <i className="text-2xl ri-map-pin-range-fill"></i>
                        <div className='px-4'>
                            <h3 className='font-bold'>Pickup</h3>
                            <p className='text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 border-b-1 border-gray-300">
                        <i className="text-2xl ri-map-pin-2-line"></i>
                        <div className='px-4'>
                            <h3 className='font-bold'>Destination</h3>
                            <p className='text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3">
                        <i className="text-2xl ri-currency-line"></i>
                        <div className='px-4'>
                            <h3 className='font-bold'>₹ {props.ride?.fare}</h3>
                            <p className='text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => {
                    props.setRidePopupPanel(false)
                }} className='w-full mt-5 bg-gray-300 text-gray-700 font-semibold text-xl rounded p-2'>Ignore</button>

                <button onClick={() => {
                    props.setConfirmRidePopupPanel(true)
                    props.setRidePopupPanel(false)
                    props.confirmRide(props.ride._id)
                }} className='w-full mt-1 bg-green-600 text-white font-semibold text-xl rounded p-2'>Accept</button>


            </div>

        </div>
    )
}

export default RidePopUp

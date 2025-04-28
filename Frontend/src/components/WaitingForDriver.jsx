import React from 'react'

const WaitingForDriver = (props) => {
  return (
    <div>
    <h5 onClick={() => {
        props.setWaitingForDriver(false)
    }} className='p-1 text-center w-[93%] absolute top-0 '><i className="text-3xl text-gray-500 ri-arrow-down-wide-fill"></i>
    </h5>

    <div className='flex justify-between items-center'>
    <img className='h-19' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
    <div className='text-right'>
        <h2 className='text-lg font-medium capitalize'>{props.ride?.captain?.fullname.firstname} {props.ride?.captain?.fullname.lastname}</h2>
        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{props.ride?.captain.vehicle.plate}</h4>
        <p className='text-sm text-gray-600'>{props.ride?.captain?.vehicle.vehicleType}</p>
        <h1 className='text-lg font-medium text-green-500'>OTP:  {props.ride?.otp}</h1>
    </div>
    </div>

    <div className='flex flex-col justify-between items-center gap-5'>
        <div className='w-full mt-5'>
            <div className='flex items-center gap-2 p-3 border-b-1 border-gray-300'>
                <i className="text-2xl ri-map-pin-range-fill"></i>
                <div className='px-4'>
                    <h3 className='font-bold text-xl'>Pickup</h3>
                    <p className=' text-gray-600'>{props.ride?.pickup}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 p-3 border-b-1 border-gray-300">
                <i className="text-2xl ri-map-pin-2-line"></i>
                <div className='px-4'>
                    <h3 className='font-bold text-xl'>Destination</h3>
                    <p className=' text-gray-600'>{props.ride?.destination}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 p-3 ">
                <i className="text-2xl ri-currency-line"></i>
                <div className='px-4'>
                    <h3 className='font-bold text-xl'>₹{props.ride?.fare}</h3>
                    <p className=' text-gray-600'>Cash</p>
                </div>
            </div>
        </div>
    </div>

</div>
  )
}

export default WaitingForDriver

import React from 'react'

const LookingForDriver = (props) => {
    return (
        <div>
            <h5 onClick={() => {
                props.setVehicleFound(false)
            }}
                className='p-1 text-center w-[93%] absolute top-0 '><i className="text-3xl text-gray-500 ri-arrow-down-wide-fill"></i></h5>
            <h3 className='text-xl font-semibold '>Looking for Driver</h3>
            <div className='flex flex-col justify-between items-center gap-2'>

                <img className='-mt-7' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />

                <div className='w-full'>
                    <div className='flex items-center gap-2 p-3 border-b-1 border-gray-300'>
                        <i className="text-2xl ri-map-pin-range-fill"></i>
                        <div className='px-4'>
                            <h3 className='font-bold text-bold'>Pickup</h3>
                            <p className=' text-gray-600 text-bold'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 border-b-1 border-gray-300">
                        <i className="text-2xl ri-map-pin-2-line"></i>
                        <div className='px-4'>
                            <h3 className='font-bold'>Destination</h3>
                            <p className=' text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 ">
                        <i className="text-2xl ri-currency-line"></i>
                        <div className='px-4'>
                            <h3 className='font-bold '>{props.fare[props.vehicleType]}</h3>
                            <p className=' text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LookingForDriver

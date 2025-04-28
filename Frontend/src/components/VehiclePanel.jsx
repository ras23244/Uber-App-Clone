import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div>
            <h5 onClick={() => {
                props.setVehiclePanelOpen(false)
            }}
                className='p-1 text-center w-[93%] absolute top-0 '><i className="text-3xl text-gray-500 ri-arrow-down-wide-fill"></i></h5>
            <h3 className='text-2xl font-semibold mb-3'>Choose a Vehicle</h3>

            <div onClick={() => {
                props.setVehicle('car')
                props.setConfirmRidePanel(true)
                props.setVehiclePanelOpen(false)
            }} className='flex w-full  items-center justify-between p-3 active:border-2 active:border-black  rounded-xl mb-2'>
                <img className='h-12' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
                <div className='w-3/2'>
                    <h4 className='font-medium text-lg'>UberGo  <span><i className="ri-user-3-fill"></i> 4</span></h4>
                    <h5 className='font-normal text-gray-700 text-sm'>
                        2 min away
                    </h5>
                    <p className='font-normal text-gray-700 text-sm'>Affrodable, compact rides</p>
                </div>
                <h2 className='text-lg font-semibold'>{props.fare.car}</h2>
            </div>


            <div onClick={() => {
                props.setVehicle('bike')
                props.setConfirmRidePanel(true)
                props.setVehiclePanelOpen(false)
            }} className='flex w-full  items-center justify-between p-3  active:border-2 active:border-black rounded-xl mb-2'>
                <img className='h-12' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQTJw6dzEo1MYXOAbONCG1oL82rxU_Bitb-g&s" alt="" />
                <div className='w-3/2'>
                    <h4 className='font-medium text-lg'>UberMoto  <span><i className="ri-user-3-fill"></i> 2</span></h4>
                    <h5 className='font-normal text-gray-700 text-sm'>
                        2 min away
                    </h5>
                    <p className='font-normal text-gray-700 text-sm'>Affrodable, compact rides</p>
                </div>
                <h2 className='text-lg font-semibold'>{props.fare.bike}</h2>
            </div>


            <div 
                onClick={() => {
                    props.setVehicle('auto')
                    props.setConfirmRidePanel(true)
                    props.setVehiclePanelOpen(false)
                }} 
                className='flex w-full  items-center justify-between p-3  active:border-2 active:border-black rounded-xl mb-2'>
                <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="" />
                <div className='w-3/2'>
                    <h4 className='font-medium text-lg'>UberAuto  <span><i className="ri-user-3-fill"></i> 5</span></h4>
                    <h5 className='font-normal text-gray-700 text-sm'>
                        2 min away
                    </h5>
                    <p className='font-normal text-gray-700 text-sm'>Affrodable, compact rides</p>
                </div>
                <h2 className='text-lg font-semibold'>{props.fare.auto}</h2>
            </div>

        </div>
    )
}

export default VehiclePanel

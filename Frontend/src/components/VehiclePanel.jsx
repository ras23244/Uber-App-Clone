// import React from 'react'

// const VehiclePanel = (props) => {
//     return (
//         <div>
//             <h5 onClick={() => {
//                 props.setVehiclePanelOpen(false)
//             }}
//                 className='p-1 text-center w-[93%] absolute top-0 '><i className="text-3xl text-gray-500 ri-arrow-down-wide-fill"></i></h5>
//             <h3 className='text-2xl font-semibold mb-3'>Choose a Vehicle</h3>

//             <div onClick={() => {
//                 props.setVehicle('car')
//                 props.setConfirmRidePanel(true)
//                 props.setVehiclePanelOpen(false)
//             }} className='flex w-full  items-center justify-between p-3 active:border-2 active:border-black  rounded-xl mb-2'>
//                 <img className='h-12' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
//                 <div className='w-3/2'>
//                     <h4 className='font-medium text-lg'>UberGo  <span><i className="ri-user-3-fill"></i> 4</span></h4>
//                     <h5 className='font-normal text-gray-700 text-sm'>
//                         2 min away
//                     </h5>
//                     <p className='font-normal text-gray-700 text-sm'>Affrodable, compact rides</p>
//                 </div>
//                 <h2 className='text-lg font-semibold'>{props.fare.car}</h2>
//             </div>


//             <div onClick={() => {
//                 props.setVehicle('bike')
//                 props.setConfirmRidePanel(true)
//                 props.setVehiclePanelOpen(false)
//             }} className='flex w-full  items-center justify-between p-3  active:border-2 active:border-black rounded-xl mb-2'>
//                 <img className='h-12' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQTJw6dzEo1MYXOAbONCG1oL82rxU_Bitb-g&s" alt="" />
//                 <div className='w-3/2'>
//                     <h4 className='font-medium text-lg'>UberMoto  <span><i className="ri-user-3-fill"></i> 2</span></h4>
//                     <h5 className='font-normal text-gray-700 text-sm'>
//                         2 min away
//                     </h5>
//                     <p className='font-normal text-gray-700 text-sm'>Affrodable, compact rides</p>
//                 </div>
//                 <h2 className='text-lg font-semibold'>{props.fare.bike}</h2>
//             </div>


//             <div 
//                 onClick={() => {
//                     props.setVehicle('auto')
//                     props.setConfirmRidePanel(true)
//                     props.setVehiclePanelOpen(false)
//                 }} 
//                 className='flex w-full  items-center justify-between p-3  active:border-2 active:border-black rounded-xl mb-2'>
//                 <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="" />
//                 <div className='w-3/2'>
//                     <h4 className='font-medium text-lg'>UberAuto  <span><i className="ri-user-3-fill"></i> 5</span></h4>
//                     <h5 className='font-normal text-gray-700 text-sm'>
//                         2 min away
//                     </h5>
//                     <p className='font-normal text-gray-700 text-sm'>Affrodable, compact rides</p>
//                 </div>
//                 <h2 className='text-lg font-semibold'>{props.fare.auto}</h2>
//             </div>

//         </div>
//     )
// }

// export default VehiclePanel


// import React from 'react';

// const VehicleCard = ({
//     type,
//     title,
//     passengers,
//     description,
//     fare,
//     duration,
//     icon,
//     setVehicle,
//     setConfirmRidePanel,
//     setVehiclePanelOpen
// }) => {
//     const handleSelect = () => {
//         setVehicle(type);
//         setConfirmRidePanel(true);
//         setVehiclePanelOpen(false);
//     };

//     return (
//         <button
//             type="button"
//             onClick={handleSelect}
//             className="
//                 flex w-full items-center gap-3
//                 rounded-2xl border border-gray-200
//                 bg-white p-4 text-left
//                 shadow-sm
//                 transition-all
//                 hover:border-black hover:shadow-md
//                 active:scale-[0.98]
//             "
//         >
//             {/* Vehicle icon */}
//             <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
//                 <i className={`${icon} text-4xl text-gray-800`}></i>
//             </div>

//             {/* Vehicle information */}
//             <div className="min-w-0 flex-1">
//                 <div className="flex items-center gap-2">
//                     <h4 className="truncate text-base font-semibold">
//                         {title}
//                     </h4>

//                     <span className="flex flex-shrink-0 items-center gap-1 text-sm text-gray-600">
//                         <i className="ri-user-3-fill"></i>
//                         {passengers}
//                     </span>
//                 </div>

//                 <p className="mt-1 text-sm font-medium text-gray-700">
//                     2 min away
//                 </p>

//                 <p className="mt-1 text-xs text-gray-500">
//                     {description}
//                 </p>
//             </div>

//             {/* Fare */}
//             <div className="flex-shrink-0 text-right">
//                 <p className="text-lg font-bold">
//                     ₹{fare}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                     Cash
//                 </p>
//             </div>
//         </button>
//     );
// };

// const VehiclePanel = (props) => {
//     return (
//         <div className="flex h-full min-h-0 flex-col">

//             {/* Header */}
//             <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 pb-4">
//                 <div>
//                     <h2 className="text-xl font-bold">
//                         Choose a vehicle
//                     </h2>
//                     <p className="mt-1 text-sm text-gray-500">
//                         Select your preferred ride
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     onClick={() => props.setVehiclePanelOpen(false)}
//                     className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 active:scale-95"
//                 >
//                     <i className="ri-close-line text-xl"></i>
//                 </button>
//             </div>

//             {/* Scrollable vehicle list */}
//             <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pb-4">

//                 <VehicleCard
//                     type="car"
//                     title="UberGo"
//                     passengers="4"
//                     description="Affordable, compact rides"
//                     fare={props.fare?.car}
//                     icon="ri-car-fill"
//                     setVehicle={props.setVehicle}
//                     setConfirmRidePanel={props.setConfirmRidePanel}
//                     setVehiclePanelOpen={props.setVehiclePanelOpen}
//                 />

//                 <VehicleCard
//                     type="bike"
//                     title="UberMoto"
//                     passengers="2"
//                     description="Fast and affordable bike rides"
//                     fare={props.fare?.bike}
//                     icon="ri-motorbike-fill"
//                     setVehicle={props.setVehicle}
//                     setConfirmRidePanel={props.setConfirmRidePanel}
//                     setVehiclePanelOpen={props.setVehiclePanelOpen}
//                 />

//                 <VehicleCard
//                     type="auto"
//                     title="UberAuto"
//                     passengers="3"
//                     description="Comfortable auto rides"
//                     fare={props.fare?.auto}
//                     icon="ri-taxi-fill"
//                     setVehicle={props.setVehicle}
//                     setConfirmRidePanel={props.setConfirmRidePanel}
//                     setVehiclePanelOpen={props.setVehiclePanelOpen}
//                 />

//             </div>
//         </div>
//     );
// };

// export default VehiclePanel;


import React from 'react';

const VehicleCard = ({
    type,
    title,
    passengers,
    description,
    fare,
    duration,
    icon,
    setVehicle,
    setConfirmRidePanel,
    setVehiclePanelOpen
}) => {

    const handleSelect = () => {
        setVehicle(type);
        setConfirmRidePanel(true);
        setVehiclePanelOpen(false);
    };

    return (
        <button
            type="button"
            onClick={handleSelect}
            className="
                flex w-full items-center gap-3
                rounded-2xl border border-gray-200
                bg-white p-4 text-left
                shadow-sm
                transition-all
                hover:border-black hover:shadow-md
                active:scale-[0.98]
            "
        >
            {/* Vehicle icon */}
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <i className={`${ icon } text - 4xl text - gray - 800`}></i>
            </div>

            {/* Vehicle information */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <h4 className="truncate text-base font-semibold">
                        {title}
                    </h4>

                    <span className="flex flex-shrink-0 items-center gap-1 text-sm text-gray-600">
                        <i className="ri-user-3-fill"></i>
                        {passengers}
                    </span>
                </div>

                {/* Actual pickup -> destination duration */}
                <p className="mt-1 text-sm font-medium text-gray-700">
                    {duration || 'Calculating time...'}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    {description}
                </p>
            </div>

            {/* Fare */}
            <div className="flex-shrink-0 text-right">
                <p className="text-lg font-bold">
                    ₹{fare}
                </p>

                <p className="text-xs text-gray-500">
                    Cash
                </p>
            </div>
        </button>
    );
};


const VehiclePanel = (props) => {

    return (
        <div className="flex h-full min-h-0 flex-col">

            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-xl font-bold">
                        Choose a vehicle
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Select your preferred ride
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => props.setVehiclePanelOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 active:scale-95"
                >
                    <i className="ri-close-line text-xl"></i>
                </button>
            </div>

            {/* Scrollable vehicle list */}
            <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pb-4">

                <VehicleCard
                    type="car"
                    title="UberGo"
                    passengers="4"
                    description="Affordable, compact rides"
                    fare={props.fare?.car}
                    duration={props.duration}
                    icon="ri-car-fill"
                    setVehicle={props.setVehicle}
                    setConfirmRidePanel={props.setConfirmRidePanel}
                    setVehiclePanelOpen={props.setVehiclePanelOpen}
                />

                <VehicleCard
                    type="bike"
                    title="UberMoto"
                    passengers="2"
                    description="Fast and affordable bike rides"
                    fare={props.fare?.bike}
                    duration={props.duration}
                    icon="ri-motorbike-fill"
                    setVehicle={props.setVehicle}
                    setConfirmRidePanel={props.setConfirmRidePanel}
                    setVehiclePanelOpen={props.setVehiclePanelOpen}
                />

                <VehicleCard
                    type="auto"
                    title="UberAuto"
                    passengers="3"
                    description="Comfortable auto rides"
                    fare={props.fare?.auto}
                    duration={props.duration}
                    icon="ri-taxi-fill"
                    setVehicle={props.setVehicle}
                    setConfirmRidePanel={props.setConfirmRidePanel}
                    setVehiclePanelOpen={props.setVehiclePanelOpen}
                />

            </div>
        </div>
    );
};

export default VehiclePanel;

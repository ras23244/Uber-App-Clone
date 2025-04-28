import React from 'react'

const LocationSearchPanel = (props) => {
    const { suggestions, setPickup, setDestination, isPickup } = props;

    return (
        <div>
            {
                suggestions.map((location, idx) => {
                    return <div key={idx} onClick={() => {
                        if (isPickup) {
                            setPickup(location.description);
                        } else {
                            setDestination(location.description);
                        }
                        // props.setPanelOpen(false);
                        // props.setVehiclePanelOpen(true);
                    }} className='flex items-center border-2 border-gray-300 active:border-black p-3 rounded-xl justify-start gap-4 my-4'>
                        <h2 className='bg-[#eee] h-10 w-14 flex items-center justify-center rounded-full'><i className="ri-map-pin-2-fill"></i></h2>
                        <h4 className='font-medium'>{location.description}</h4>
                    </div>
                })
            }
        </div>
    )
}

export default LocationSearchPanel

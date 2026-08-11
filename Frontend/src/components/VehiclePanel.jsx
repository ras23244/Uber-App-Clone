

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

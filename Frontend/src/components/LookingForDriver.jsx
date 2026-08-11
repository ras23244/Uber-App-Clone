// import React from 'react';

const LookingForDriver = (props) => {
    const fare = props.fare?.[props.vehicleType];

    return (
        <div className="flex h-full min-h-0 flex-col">

            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-xl font-bold">
                        Finding your driver
                    </h2>

                    <p className="text-sm text-gray-500">
                        Please wait while we find a nearby captain
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => props.setVehicleFound(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                >
                    <i className="ri-close-line text-xl"></i>
                </button>
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto">

                {/* Loading animation */}
                <div className="flex flex-col items-center py-6">
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-green-50">
                        <div className="absolute h-24 w-24 animate-ping rounded-full bg-green-200 opacity-40"></div>

                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <i className="ri-car-fill text-4xl text-green-600"></i>
                        </div>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                        Looking for a driver...
                    </h3>

                    <p className="mt-1 text-center text-sm text-gray-500">
                        Searching nearby captains
                    </p>
                </div>

                {/* Pickup */}
                <div className="flex items-start gap-3 border-b border-gray-200 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                        <i className="ri-map-pin-range-fill text-xl text-green-600"></i>
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-bold">
                            Pickup
                        </h3>

                        <p className="mt-1 break-words text-sm text-gray-600">
                            {props.pickup}
                        </p>
                    </div>
                </div>

                {/* Destination */}
                <div className="flex items-start gap-3 border-b border-gray-200 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                        <i className="ri-map-pin-2-line text-xl text-red-600"></i>
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-bold">
                            Destination
                        </h3>

                        <p className="mt-1 break-words text-sm text-gray-600">
                            {props.destination}
                        </p>
                    </div>
                </div>

                {/* Fare */}
                <div className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                        <i className="ri-currency-line text-xl text-yellow-600"></i>
                    </div>

                    <div>
                        <h3 className="font-bold">
                            ₹{fare}
                        </h3>

                        <p className="text-sm text-gray-600">
                            Cash payment
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LookingForDriver;
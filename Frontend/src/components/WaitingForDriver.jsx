// import React from 'react';

const WaitingForDriver = (props) => {
    const captain = props.ride?.captain;

    return (
        <div className="flex h-full min-h-0 flex-col">

            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-xl font-bold">
                        Driver assigned
                    </h2>

                    <p className="text-sm text-gray-500">
                        Your captain is on the way
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        props.setWaitingForDriver(false)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                >
                    <i className="ri-close-line text-xl"></i>
                </button>
            </div>

            {/* Scrollable content */}
            <div className="min-h-0 flex-1 overflow-y-auto">

                {/* Captain information */}
                <div className="my-5 flex items-center gap-4 rounded-2xl bg-gray-50 p-4">

                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
                        <i className="ri-user-3-fill text-4xl text-gray-600"></i>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-lg font-bold capitalize">
                            {captain?.fullname?.firstname}{' '}
                            {captain?.fullname?.lastname}
                        </h2>

                        <h4 className="mt-1 text-xl font-bold">
                            {captain?.vehicle?.plate || '---'}
                        </h4>

                        <p className="mt-1 text-sm capitalize text-gray-500">
                            {captain?.vehicle?.vehicleType || 'Vehicle'}
                        </p>
                    </div>

                    {/* OTP */}
                    <div className="flex-shrink-0 rounded-xl bg-green-100 px-3 py-2 text-center">
                        <p className="text-xs font-medium text-green-700">
                            OTP
                        </p>

                        <p className="text-lg font-bold text-green-700">
                            {props.ride?.otp || '----'}
                        </p>
                    </div>
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
                            {props.ride?.pickup}
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
                            {props.ride?.destination}
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
                            ₹{props.ride?.fare}
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

export default WaitingForDriver;
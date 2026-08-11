
import React from 'react'

const ConfirmedRide = (props) => {

    const handleConfirmRide = async () => {

        try {

            // Hide confirmation panel
            props.setConfirmRidePanel(false)

            // Show looking-for-driver panel
            props.setVehicleFound(true)

            // Mark confirm button as clicked
            props.setIsConfirmRidebuttonClicked(true)

            // Create ride
            await props.createRide()

        } catch (error) {

            console.error(
                'Error confirming ride:',
                error
            )

            // If ride creation fails,
            // restore confirmation panel
            props.setVehicleFound(false)

            props.setIsConfirmRidebuttonClicked(false)

            props.setConfirmRidePanel(true)

        }

    }


    return (

        <div className="w-full">

            {/* Header */}
            <div className="relative flex items-center justify-center mb-4">

                <h2 className="text-xl font-bold">
                    Confirm your vehicle
                </h2>

                <button
                    type="button"
                    onClick={() => props.setConfirmRidePanel(false)}
                    className="
                        absolute
                        right-0
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-gray-100
                        text-xl
                        active:scale-95
                    "
                >
                    <i className="ri-close-line"></i>
                </button>

            </div>


            {/* Vehicle image */}
            <div className="flex justify-center">

                <img
                    className="h-28 object-contain"
                    src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
                    alt="Selected vehicle"
                />

            </div>


            {/* Ride details */}
            <div className="w-full mt-4">


                {/* Pickup */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">

                    <i className="text-2xl ri-map-pin-range-fill"></i>

                    <div className="px-2 min-w-0">

                        <h3 className="font-bold">
                            Pickup
                        </h3>

                        <p className="text-gray-600 text-sm break-words">
                            {props.pickup}
                        </p>

                    </div>

                </div>


                {/* Destination */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">

                    <i className="text-2xl ri-map-pin-2-line"></i>

                    <div className="px-2 min-w-0">

                        <h3 className="font-bold">
                            Destination
                        </h3>

                        <p className="text-gray-600 text-sm break-words">
                            {props.destination}
                        </p>

                    </div>

                </div>


                {/* Fare */}
                <div className="flex items-center gap-3 p-4">

                    <i className="text-2xl ri-currency-line"></i>

                    <div className="px-2">

                        <h3 className="font-bold">

                            ₹
                            {props.fare?.[props.vehicleType] ?? '--'}

                        </h3>

                        <p className="text-gray-600 text-sm">
                            Cash
                        </p>

                    </div>

                </div>

            </div>


            {/* Confirm button */}
            <button
                type="button"
                onClick={handleConfirmRide}
                disabled={!props.vehicleType}
                className="
                    w-full
                    mt-5
                    bg-green-600
                    hover:bg-green-700
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    text-lg
                    rounded-xl
                    p-3
                    transition
                    active:scale-[0.98]
                "
            >
                Confirm Ride
            </button>

        </div>

    )

}

export default ConfirmedRide
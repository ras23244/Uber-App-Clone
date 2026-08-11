
import React from 'react';

const LocationSearchPanel = (props) => {
    const {
        suggestions = [],
        setPickup,
        setDestination,
        isPickup,
        setPickupCoords,
        setDestinationCoords,
        setPanelOpen
    } = props;

    const handleLocationSelect = (location) => {
        if (isPickup) {
            setPickup(location.description);

            if (setPickupCoords) {
                setPickupCoords({
                    lat: location.lat,
                    lng: location.lng
                });
            }
        } else {
            setDestination(location.description);

            if (setDestinationCoords) {
                setDestinationCoords({
                    lat: location.lat,
                    lng: location.lng
                });
            }
        }

        if (setPanelOpen) {
            setPanelOpen(false);
        }
    };

    return (
        <div className="max-h-[45vh] overflow-y-auto pr-1">
            {suggestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <i className="ri-map-pin-line text-4xl text-gray-400"></i>

                    <p className="mt-2 text-sm font-medium text-gray-500">
                        No locations found
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {suggestions.map((location, idx) => (
                        <button
                            type="button"
                            key={`${location.description}-${idx}`}
                            onClick={() =>
                                handleLocationSelect(location)
                            }
                            className="
                                flex w-full items-center
                                gap-4 rounded-xl
                                border border-gray-200
                                bg-white p-3 text-left
                                transition
                                hover:border-black
                                active:scale-[0.99]
                            "
                        >
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                                <i className="ri-map-pin-2-fill text-lg text-gray-700"></i>
                            </div>

                            <div className="min-w-0 flex-1">
                                <h4 className="truncate text-sm font-semibold text-gray-900">
                                    {location.description}
                                </h4>

                                <p className="mt-1 text-xs text-gray-500">
                                    Select this location
                                </p>
                            </div>

                            <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationSearchPanel;
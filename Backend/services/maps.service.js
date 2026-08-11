
const axios = require('axios');
const captainModel = require('../models/captain.model');

// ------------------------------------------------------------
// Photon configuration
// ------------------------------------------------------------

const PHOTON_BASE_URL = 'https://photon.komoot.io/api';

// Small in-memory cache.
// This prevents repeatedly querying the public geocoding service
// for exactly the same address/input.
const geocodeCache = new Map();
const autocompleteCache = new Map();

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

let lastPhotonRequest = 0;

// Keep requests reasonably spaced when using the public Photon server.
const PHOTON_MIN_INTERVAL = 300;

// ------------------------------------------------------------
// Photon request helper
// ------------------------------------------------------------

async function photonRequest(params) {
    const now = Date.now();

    const wait = PHOTON_MIN_INTERVAL - (now - lastPhotonRequest);

    if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
    }

    lastPhotonRequest = Date.now();

    return axios.get(PHOTON_BASE_URL, {
        params,
        headers: {
            'User-Agent': 'UberCloneApp/1.0'
        },
        timeout: 10000
    });
}

// ------------------------------------------------------------
// Helper: create readable address
// ------------------------------------------------------------

function createDescription(properties = {}) {
    const parts = [];

    if (properties.name) {
        parts.push(properties.name);
    }

    if (
        properties.housenumber &&
        properties.street
    ) {
        parts.push(
            `${properties.housenumber} ${properties.street}`
        );
    } else if (properties.street) {
        parts.push(properties.street);
    }

    if (properties.locality) {
        parts.push(properties.locality);
    }

    if (properties.district) {
        parts.push(properties.district);
    }

    if (properties.city) {
        parts.push(properties.city);
    }

    if (properties.state) {
        parts.push(properties.state);
    }

    if (properties.country) {
        parts.push(properties.country);
    }

    // Remove duplicates while preserving order
    return [...new Set(parts.filter(Boolean))].join(', ');
}

// ------------------------------------------------------------
// Helper: check cache
// ------------------------------------------------------------

function getCachedValue(cache, key) {
    const cached = cache.get(key);

    if (!cached) {
        return null;
    }

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
        cache.delete(key);
        return null;
    }

    return cached.value;
}

// ------------------------------------------------------------
// Helper: save cache
// ------------------------------------------------------------

function setCachedValue(cache, key, value) {
    cache.set(key, {
        value,
        timestamp: Date.now()
    });
}

// ------------------------------------------------------------
// Get coordinates from address
// ------------------------------------------------------------

module.exports.getAddressCoordinate = async (address) => {
    if (!address || typeof address !== 'string') {
        throw new Error('Address is required');
    }

    const normalizedAddress = address.trim().toLowerCase();

    if (!normalizedAddress) {
        throw new Error('Address is required');
    }

    // Check cache first
    const cached = getCachedValue(
        geocodeCache,
        normalizedAddress
    );

    if (cached) {
        return cached;
    }

    try {
        const response = await photonRequest({
            q: address,
            limit: 1
        });

        if (
            response.data &&
            response.data.features &&
            response.data.features.length > 0
        ) {
            const feature = response.data.features[0];

            const coordinates = feature.geometry?.coordinates;

            if (
                !coordinates ||
                coordinates.length < 2
            ) {
                throw new Error(
                    'Invalid coordinates returned by Photon'
                );
            }

            const result = {
                lat: parseFloat(coordinates[1]),
                lng: parseFloat(coordinates[0])
            };

            setCachedValue(
                geocodeCache,
                normalizedAddress,
                result
            );

            return result;
        }

        throw new Error('Unable to fetch coordinates');

    } catch (error) {
        console.error(
            'Photon geocoding error:',
            error.response?.data || error.message
        );

        throw new Error('Error fetching coordinates');
    }
};

// ------------------------------------------------------------
// Get distance + duration + route geometry
// ------------------------------------------------------------

module.exports.getDistanceTime = async (
    origin,
    destination
) => {
    if (!origin || !destination) {
        throw new Error(
            'Origin and destination are required'
        );
    }

    try {
        // Geocode both addresses
        const [
            originCoords,
            destinationCoords
        ] = await Promise.all([
            module.exports.getAddressCoordinate(origin),
            module.exports.getAddressCoordinate(destination)
        ]);

        // OSRM routing API
        const url =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${originCoords.lng},${originCoords.lat};` +
            `${destinationCoords.lng},${destinationCoords.lat}` +
            `?overview=full&geometries=geojson`;

        const response = await axios.get(url, {
            timeout: 15000
        });

        if (
            response.data &&
            response.data.code === 'Ok' &&
            response.data.routes &&
            response.data.routes.length > 0
        ) {
            const route = response.data.routes[0];

            return {
                distance: {
                    text: `${(
                        route.distance / 1000
                    ).toFixed(1)} km`,

                    value: route.distance
                },

                duration: {
                    text: `${Math.ceil(
                        route.duration / 60
                    )} mins`,

                    value: route.duration
                },

                geometry: route.geometry
            };
        }

        throw new Error('No routes found');

    } catch (error) {
        console.error(
            'Routing error:',
            error.response?.data || error.message
        );

        throw error;
    }
};

// ------------------------------------------------------------
// Autocomplete suggestions
// ------------------------------------------------------------

module.exports.getAutoCompleteSuggestions = async (
    input
) => {
    if (!input || typeof input !== 'string') {
        throw new Error(
            'Address is required for suggestion'
        );
    }

    const normalizedInput = input.trim().toLowerCase();

    if (!normalizedInput) {
        return [];
    }

    // Check cache
    const cached = getCachedValue(
        autocompleteCache,
        normalizedInput
    );

    if (cached) {
        return cached;
    }

    try {
        const response = await photonRequest({
            q: input,
            limit: 5
        });

        if (
            !response.data ||
            !response.data.features
        ) {
            return [];
        }

        const suggestions =
            response.data.features
                .map((feature) => {
                    const coordinates =
                        feature.geometry?.coordinates;

                    if (
                        !coordinates ||
                        coordinates.length < 2
                    ) {
                        return null;
                    }

                    const properties =
                        feature.properties || {};

                    return {
                        description:
                            createDescription(properties),

                        lat: parseFloat(
                            coordinates[1]
                        ),

                        lng: parseFloat(
                            coordinates[0]
                        )
                    };
                })
                .filter(
                    (item) =>
                        item &&
                        item.description
                );

        setCachedValue(
            autocompleteCache,
            normalizedInput,
            suggestions
        );

        return suggestions;

    } catch (error) {
        console.error(
            'Photon autocomplete error:',
            error.response?.data || error.message
        );

        throw new Error(
            'Error fetching autocomplete suggestions'
        );
    }
};

module.exports.getCaptainsInRadius = async (
    lat,
    lng,
    radiusInMeters
) => {
    try {
        const captains =
            await captainModel.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [
                                lng,
                                lat
                            ]
                        },
                        $maxDistance:
                            radiusInMeters
                    }
                },

                status: 'active'
            });

        return captains;

    } catch (error) {
        console.error(
            'Error finding captains by distance:',
            error
        );

        throw new Error(
            'Failed to get captains in radius'
        );
    }
};
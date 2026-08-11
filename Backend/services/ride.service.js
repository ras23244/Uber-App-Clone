// const rideModel = require('../models/ride.model')
// const mapService = require('./maps.service')
// const crypto = require('crypto');

// async function getFare(pickup, destination) {
//     if (!pickup || !destination) {
//         throw new Error('Pickup and destination are required');
//     }

//     const distanceTime = await mapService.getDistanceTime(pickup, destination);
//     const baseFare = {
//         auto: 30,
//         car: 50,
//         bike: 20
//     };

//     const perKmRate = {
//         auto: 10,
//         car: 15,
//         bike: 5
//     };

//     const perMinuteRate = {
//         auto: 1,
//         car: 2,
//         bike: 0.5
//     };

//     const fare = {
//         auto: Math.round(baseFare.auto + (perKmRate.auto * (distanceTime.distance.value) / 1000) + (perMinuteRate.auto * (distanceTime.duration.value) / 60)),
//         car: Math.round(baseFare.car + (perKmRate.car * (distanceTime.distance.value) / 1000) + (perMinuteRate.car * (distanceTime.duration.value) / 60)),
//         bike: Math.round(baseFare.bike + (perKmRate.bike * (distanceTime.distance.value) / 1000) + (perMinuteRate.bike * (distanceTime.duration.value) / 60))
//     };

//     return fare;
// }

// module.exports.getFare = getFare;

// function getOtp(num) {
//     const otp = crypto.randomInt(0, Math.pow(10, num)).toString().padStart(num, '0');
//     return otp;
// }

// module.exports.createRide = async ({
//     user, pickup, destination, vehicleType
// }) => {
//     if (!user || !pickup || !destination || !vehicleType) {
//         throw new Error('All fields are required')
//     }
//     const distanceTime = await mapService.getDistanceTime(pickup, destination);

//     if (!distanceTime || !distanceTime.distance || !distanceTime.duration) {
//         throw new Error('Invalid distance and time data');
//     }

//     const fare = await getFare(pickup, destination);

//     // Geocode pickup and destination for coordinate storage
//     let pickupCoordinates, destinationCoordinates;
//     try {
//         pickupCoordinates = await mapService.getAddressCoordinate(pickup);
//         destinationCoordinates = await mapService.getAddressCoordinate(destination);
//     } catch (err) {
//         console.error('Could not geocode addresses for coordinate storage:', err.message);
//     }

//     const ride = await rideModel.create({
//         user,
//         pickup,
//         destination,
//         pickupCoordinates: pickupCoordinates || undefined,
//         destinationCoordinates: destinationCoordinates || undefined,
//         duration: Math.ceil(distanceTime.duration.value / 60),
//         distance: Math.ceil(distanceTime.distance.value / 1000),
//         otp: getOtp(6).toString(),
//         fare: fare[vehicleType]
//     });
//     return ride;
// }

// module.exports.confirmRide = async (rideId, captain) => {
//     const captainId = captain._id.toString();

//     if (!rideId || !captainId) {
//         throw new Error('Ride ID and Captain ID are required');
//     }

//     const ride = await rideModel.findOneAndUpdate(
//         { _id: rideId, status: 'pending' },
//         { status: 'accepted', captain: captainId },
//         { new: true }
//     ).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found or already accepted');
//     }

//     return ride;
// };

// module.exports.startRide = async (rideId, otp, captain) => {
//     const captainId = captain._id.toString();

//     if (!rideId || !otp || !captainId) {
//         throw new Error('Ride ID, OTP and Captain ID are required');
//     }

//     const ride = await rideModel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }
//     if (ride.status !== 'accepted') {
//         throw new Error('Ride is not accepted yet');
//     }
//     if (ride.otp !== otp) {
//         throw new Error('Invalid OTP');
//     }

//     const updatedRide = await rideModel.findOneAndUpdate(
//         { _id: rideId },
//         { status: 'ongoing' },
//         { new: true }
//     ).populate('user').populate('captain');

//     return updatedRide;
// }

// module.exports.endRide = async (rideId, captain) => {
//     if (!rideId) {
//         throw new Error('Ride ID is required');
//     }
//     const captainId = captain._id ? captain._id.toString() : captain.toString();
    
//     const ride = await rideModel.findOne({ _id: rideId, captain: captainId }).populate('user').populate('captain').select('+otp');
//     if (!ride) {
//         throw new Error('Ride not found');
//     }
//     if (ride.status !== 'ongoing') {
//         throw new Error('Ride is not ongoing');
//     }
//     const updatedRide = await rideModel.findOneAndUpdate(
//         { _id: rideId },
//         { status: 'completed' },
//         { new: true }
//     ).populate('user').populate('captain');
    
//     return updatedRide;
// }

// module.exports.cancelRide = async (rideId, userId) => {
//     if (!rideId || !userId) {
//         throw new Error('Ride ID and User ID are required');
//     }
    
//     const ride = await rideModel.findOne({ _id: rideId, user: userId });
//     if (!ride) {
//         throw new Error('Ride not found');
//     }
//     if (ride.status !== 'pending' && ride.status !== 'accepted') {
//         throw new Error('Ride cannot be cancelled in current status');
//     }
    
//     const updatedRide = await rideModel.findOneAndUpdate(
//         { _id: rideId },
//         { status: 'cancelled' },
//         { new: true }
//     ).populate('user').populate('captain');
    
//     return updatedRide;
// }

const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error(
            'Pickup and destination are required'
        );
    }

    const distanceTime =
        await mapService.getDistanceTime(
            pickup,
            destination
        );

    const baseFare = {
        auto: 30,
        car: 50,
        bike: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        bike: 5
    };

    const perMinuteRate = {
        auto: 1,
        car: 2,
        bike: 0.5
    };

    const fare = {
        auto: Math.round(
            baseFare.auto +
            (
                perKmRate.auto *
                (distanceTime.distance.value / 1000)
            ) +
            (
                perMinuteRate.auto *
                (distanceTime.duration.value / 60)
            )
        ),

        car: Math.round(
            baseFare.car +
            (
                perKmRate.car *
                (distanceTime.distance.value / 1000)
            ) +
            (
                perMinuteRate.car *
                (distanceTime.duration.value / 60)
            )
        ),

        bike: Math.round(
            baseFare.bike +
            (
                perKmRate.bike *
                (distanceTime.distance.value / 1000)
            ) +
            (
                perMinuteRate.bike *
                (distanceTime.duration.value / 60)
            )
        )
    };

    return fare;
}

module.exports.getFare = getFare;

function getOtp(num) {
    const otp = crypto
        .randomInt(
            0,
            Math.pow(10, num)
        )
        .toString()
        .padStart(num, '0');

    return otp;
}

module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType
}) => {
    if (
        !user ||
        !pickup ||
        !destination ||
        !vehicleType
    ) {
        throw new Error(
            'All fields are required'
        );
    }

    const distanceTime =
        await mapService.getDistanceTime(
            pickup,
            destination
        );

    if (
        !distanceTime ||
        !distanceTime.distance ||
        !distanceTime.duration
    ) {
        throw new Error(
            'Invalid distance and time data'
        );
    }

    const fare =
        await getFare(
            pickup,
            destination
        );

    let pickupCoordinates;
    let destinationCoordinates;

    try {
        pickupCoordinates =
            await mapService
                .getAddressCoordinate(
                    pickup
                );

        destinationCoordinates =
            await mapService
                .getAddressCoordinate(
                    destination
                );

    } catch (err) {
        console.error(
            'Could not geocode addresses for coordinate storage:',
            err.message
        );
    }

    const ride =
        await rideModel.create({
            user,
            pickup,
            destination,

            pickupCoordinates:
                pickupCoordinates ||
                undefined,

            destinationCoordinates:
                destinationCoordinates ||
                undefined,

            duration: Math.ceil(
                distanceTime.duration.value / 60
            ),

            distance: Math.ceil(
                distanceTime.distance.value / 1000
            ),

            otp: getOtp(6).toString(),

            fare: fare[vehicleType]
        });

    return ride;
};

module.exports.confirmRide = async (
    rideId,
    captain
) => {
    const captainId =
        captain._id.toString();

    if (!rideId || !captainId) {
        throw new Error(
            'Ride ID and Captain ID are required'
        );
    }

    const ride =
        await rideModel.findOneAndUpdate(
            {
                _id: rideId,
                status: 'pending'
            },

            {
                status: 'accepted',
                captain: captainId
            },

            {
                new: true
            }
        )
            .populate('user')
            .populate('captain')
            .select('+otp');

    if (!ride) {
        throw new Error(
            'Ride not found or already accepted'
        );
    }

    return ride;
};

module.exports.startRide = async (
    rideId,
    otp,
    captain
) => {
    const captainId =
        captain._id.toString();

    if (
        !rideId ||
        !otp ||
        !captainId
    ) {
        throw new Error(
            'Ride ID, OTP and Captain ID are required'
        );
    }

    const ride =
        await rideModel
            .findOne({
                _id: rideId
            })
            .populate('user')
            .populate('captain')
            .select('+otp');

    if (!ride) {
        throw new Error(
            'Ride not found'
        );
    }

    if (ride.status !== 'accepted') {
        throw new Error(
            'Ride is not accepted yet'
        );
    }

    if (ride.otp !== otp) {
        throw new Error(
            'Invalid OTP'
        );
    }

    const updatedRide =
        await rideModel.findOneAndUpdate(
            {
                _id: rideId
            },

            {
                status: 'ongoing'
            },

            {
                new: true
            }
        )
            .populate('user')
            .populate('captain');

    return updatedRide;
};

module.exports.endRide = async (
    rideId,
    captain
) => {
    if (!rideId) {
        throw new Error(
            'Ride ID is required'
        );
    }

    const captainId =
        captain._id
            ? captain._id.toString()
            : captain.toString();

    const ride =
        await rideModel
            .findOne({
                _id: rideId,
                captain: captainId
            })
            .populate('user')
            .populate('captain')
            .select('+otp');

    if (!ride) {
        throw new Error(
            'Ride not found'
        );
    }

    if (ride.status !== 'ongoing') {
        throw new Error(
            'Ride is not ongoing'
        );
    }

    const updatedRide =
        await rideModel.findOneAndUpdate(
            {
                _id: rideId
            },

            {
                status: 'completed'
            },

            {
                new: true
            }
        )
            .populate('user')
            .populate('captain');

    return updatedRide;
};

module.exports.cancelRide = async (
    rideId,
    userId
) => {
    if (!rideId || !userId) {
        throw new Error(
            'Ride ID and User ID are required'
        );
    }

    const ride =
        await rideModel.findOne({
            _id: rideId,
            user: userId
        });

    if (!ride) {
        throw new Error(
            'Ride not found'
        );
    }

    if (
        ride.status !== 'pending' &&
        ride.status !== 'accepted'
    ) {
        throw new Error(
            'Ride cannot be cancelled in current status'
        );
    }

    const updatedRide =
        await rideModel.findOneAndUpdate(
            {
                _id: rideId
            },

            {
                status: 'cancelled'
            },

            {
                new: true
            }
        )
            .populate('user')
            .populate('captain');

    return updatedRide;
};
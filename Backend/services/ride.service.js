const rideModel = require('../models/ride.model')
const mapService = require('./maps.service')
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
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
        auto: Math.round(baseFare.auto + (perKmRate.auto * (distanceTime.distance.value) / 1000) + (perMinuteRate.auto * (distanceTime.duration.value) / 60)),
        car: Math.round(baseFare.car + (perKmRate.car * (distanceTime.distance.value) / 1000) + (perMinuteRate.car * (distanceTime.duration.value) / 60)),
        bike: Math.round(baseFare.bike + (perKmRate.bike * (distanceTime.distance.value) / 1000) + (perMinuteRate.bike * (distanceTime.duration.value) / 60))
    };

    return fare;
}

module.exports.getFare = getFare;

function getOtp(num) {
    const otp = crypto.randomInt(0, Math.pow(10, num)).toString().padStart(num, '0');
    return otp;
}

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required')
    }
    const distaceBetweenPickupAndDestination = await mapService.getDistanceTime(pickup, destination);

    if (!distaceBetweenPickupAndDestination || !distaceBetweenPickupAndDestination.distance || !distaceBetweenPickupAndDestination.duration) {
        console.error("Invalid distance and time data:", distaceBetweenPickupAndDestination);
        return res.status(400).json({ message: "Invalid distance and time data" });
    }
    console.log("this is distance ", distaceBetweenPickupAndDestination)

    // ride.distance = distaceBetweenPickupAndDestination.distance.text;
    const fare = await getFare(pickup, destination);
    const ride = rideModel.create({
        user,
        pickup,
        destination,
        duration: Math.ceil(distaceBetweenPickupAndDestination.duration.value / 60),
        distance: Math.ceil(distaceBetweenPickupAndDestination.distance.value/1000),
        otp: getOtp(6).toString(),
        fare: fare[vehicleType]
    });
    return ride;
}

module.exports.confirmRide = async (rideId, captain) => {
    const captainId = captain._id.toString()

    if (!rideId || !captainId) {
        throw new Error('Ride ID and Captain ID are required');
    }

    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'accepted', captain: captainId },
        { new: true }
    ).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
};

module.exports.startRide = async (rideId, otp, captain) => {
    const captainId = captain._id.toString()

    if (!rideId || !otp || !captainId) {
        throw new Error('Ride ID, OTP and Captain ID are required');
    }

    const ride = await rideModel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');


    if (!ride) {
        throw new Error('Ride not found');
    }
    if (ride.status !== 'accepted') {
        throw new Error('Ride is not accepted yet');
    }
    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }
    await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'ongoing' },
    )

    return ride;
}

module.exports.endRide = async (rideId, captain) => {
    const captainId = captain._id.toString()
    if (!rideId || !captainId) {
        throw new Error('Ride ID and Captain ID are required');
    }
    const ride = await rideModel.findOne({ _id: rideId, captain: captainId }).populate('user').populate('captain').select('+otp');
    if (ride.status !== 'ongoing') {
        throw new Error('Ride is not ongoing');
    }
    await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'completed' })
    return ride;
}

module.exports.updateCaptainLocation = async (captainId, coordinates) => {
    try {
        // Update the captain's location in the database
        const updatedCaptain = await CaptainModel.findByIdAndUpdate(
            captainId,
            { location: coordinates },
            { new: true }
        );
        return updatedCaptain;
    } catch (err) {
        throw new Error("Failed to update captain location: " + err.message);
    }
};


const rideService = require('../services/ride.service')
const { validationResult } = require('express-validator')
const mapsService = require('../services/maps.service')
const { sendMessageToSocketId } = require('../socket')
const rideModel = require('../models/ride.model')

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        
        // Send ride response to user (without OTP)
        res.status(201).json({ ride });

        // After responding, asynchronously notify nearby captains
        const pickupCoordinates = await mapsService.getAddressCoordinate(pickup);

        if (!pickupCoordinates || !pickupCoordinates.lat || !pickupCoordinates.lng) {
            console.error("Invalid pickup coordinates:", pickupCoordinates);
            return; // Already responded, just log and return
        }

        const radius = 5000000; // in meters
        const captainsInRadius = await mapsService.getCaptainsInRadius(pickupCoordinates.lat, pickupCoordinates.lng, radius);

       
        if (!captainsInRadius || captainsInRadius.length === 0) {
            console.warn("No captains found in the specified radius.");
            return;
        }

        ride.otp = "";
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })
        })

    } catch (err) {
        console.error("Error in createRide:", err);
        if (!res.headersSent) {
            return res.status(500).json({ message: err.message });
        }
    }
}

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare( pickup, destination );
        return res.status(200).json( fare );
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.confirmRide = async (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
       
        const ride = await rideService.confirmRide(rideId,req.captain);

        sendMessageToSocketId(ride.user.socketId,{
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json({ride});
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.startRide = async (req,res) =>{
    const errors = validationResult(req);   
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId, otp } = req.query;
    try{
        const ride = await rideService.startRide(rideId, otp, req.captain);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })
        return res.status(200).json({ ride });
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.endRide= async (req,res) =>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {rideId} = req.body;
    try{
        const ride = await rideService.endRide(rideId, req.captain);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })
        return res.status(200).json({ ride });
    } catch(err){
        return res.status(500).json({ message: err.message })
    }

}

module.exports.cancelRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { rideId } = req.body;
    
    try {
        const ride = await rideService.cancelRide(rideId, req.user._id);
        
        // Notify captain if ride was already accepted
        if (ride.captain && ride.captain.socketId) {
            sendMessageToSocketId(ride.captain.socketId, {
                event: 'ride-cancelled',
                data: ride
            });
        }
        
        return res.status(200).json({ ride });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

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

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(200).json({ ride });

        const pickupCoordinates = await mapsService.getAddressCoordinate(pickup);
       

        if (!pickupCoordinates || !pickupCoordinates.ltd || !pickupCoordinates.lng) {
            console.error("Invalid pickup coordinates:", pickupCoordinates);
            return res.status(400).json({ message: "Invalid pickup coordinates" });
        }
        
        const radius = 100000000; // in km
        const captainsInRadius = await mapsService.getCaptainsInRadius(pickupCoordinates.ltd, pickupCoordinates.lng, radius);
        
      console.log("Captains in radius:", captainsInRadius);  

        if (!captainsInRadius || captainsInRadius.length === 0) {
            console.warn("No captains found in the specified radius.");
        }

        ride.otp = ""; 
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
   

        captainsInRadius.map(captain=>{
            sendMessageToSocketId(captain.socketId,{
            event: 'new-ride',
            data: rideWithUser
        })
        })

    } catch (err) {
        console.error("Error in createRide:", err);
        return res.status(500).json({ message: err.message });
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
        const ride = await rideService.endRide(rideId,req.captain._id);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })
        return res.status(200).json({ ride });
    } catch(err){
        return res.status(500).json({ message: err.message })
    }

}

module.exports.updateCaptainLocation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { captainId, lng, ltd } = req.body;

    try {
        // Update captain's location in the database
        const updatedCaptain = await rideService.updateCaptainLocation(captainId, { lng, ltd });

        // Notify clients about the updated location
        sendMessageToSocketId(updatedCaptain.socketId, {
            event: 'location-updated',
            data: { lng, ltd }
        });

        return res.status(200).json({ message: "Location updated successfully", location: { lng, ltd } });
    } catch (err) {
        console.error("Error in updateCaptainLocation:", err);
        return res.status(500).json({ message: err.message });
    }
};
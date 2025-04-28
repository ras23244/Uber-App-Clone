const captainModel=require('../models/captain.model');
const captainService=require('../services/captain.service');
const {validationResult}=require('express-validator');
const blackListTokenModel=require('../models/blacklistToken.model');
const rideModel = require('../models/ride.model');

module.exports.registerCaptain=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {fullname,email,password,vehicle}=req.body;

    const existingCaptain=await captainModel.findOne({email});
    if(existingCaptain){
        return res.status(400).json({message:"Captain already exists"});
    }

    const hashedPassword=await captainModel.hashPassword(password);

    const captain=await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
    })

    const token=captain.generateAuthToken();
    res.status(201).json({captain,token});
} 

module.exports.loginCaptain=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password}=req.body;

    const captain=await captainModel.findOne({email}).select('+password');
    if(!captain){
        return res.status(400).json({message:"Invalid email or  password"});
    }

    const isMatch=await captain.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid password"});
    }

    const token=captain.generateAuthToken();
    res.cookie('token',token)
    res.status(200).json({token,captain});
}

module.exports.getCaptainProfile = async(req,res,next)=>{
    const captain=req.captain;
    res.status(200).json({captain});
}

module.exports.getDailyStats = async (req,res,next) =>{
    try{

        const captainId = req.captain._id;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const rides = await rideModel.find({
            captain: captainId,
            status: 'completed',
            updatedAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        })

        const totalEarnings =rides.reduce((sum,ride) => sum + ride.fare, 0);
        const totalRides = rides.length;
        const totalDistance = rides.reduce((sum,ride) => sum + ride.distance, 0);
        const totalTime = rides.reduce((sum,ride) => sum + ride.duration, 0);

        res.status(200).json({
            totalEarnings,
            totalDistance,
            totalRides,
            totalTime
        });

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }

}

module.exports.logoutCaptain=async(req,res,next)=>{
    res.clearCookie('token');
    const token=req.cookies.token || req.headers.authorization.split(' ')[1];
    
    await blackListTokenModel.create({token});
    res.status(200).json({message:"Logged out successfully"});
}

module.exports.updateCaptainLocation = async (req, res, next) => {
  const { lng, ltd } = req.body;
  const captainId = req.captain._id;

  if (!lng || !ltd) {
    return res.status(400).json({ message: 'Longitude and latitude are required.' });
  }

  try {
    const updatedCaptain = await captainService.updateCaptainLocation(captainId, { lng, ltd });
    res.status(200).json({ message: 'Location updated successfully', captain: updatedCaptain });
  } catch (err) {
    console.error('Error updating captain location:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

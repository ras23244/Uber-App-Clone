const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching coordinates');
    }
}

module.exports.getDistanceTime= async(origin, destination)=>{
    if(!origin || !destination){
        throw new Error('Origin and destination are required');
    }
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    try{

        const response= await axios.get(url);
        if(response.data.status==='OK'){
            if(response.data.rows[0].elements[0].status==='ZERO_RESULTS'){
                throw new Error('No routes found');
            }
            return response.data.rows[0].elements[0];
        }
        else{
            throw new Error('Unable to fetch distance and time');
        }

    }catch(err){
        console.error(err);
        throw  err;
    }

}

module.exports.getAutoCompleteSuggestions=async(input)=>{
    if(!input){
        throw new Error('Address is required for suggestion')
    }
    const apiKey= process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error('Unable to fetch autocomplete suggestions');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching autocomplete suggestions');
    }
}

// Haversine distance function
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

module.exports.getCaptainsInRadius = async (ltd, lng, radius) => {
    try {
        // Fetch all captains that have coordinates
        const allCaptains = await captainModel.find({
            'location.ltd': { $exists: true },
            'location.lng': { $exists: true }
        });
        console.log("this is all captains",allCaptains)
        // Filter based on calculated distance
        const nearbyCaptains = allCaptains.filter(captain => {
            const lat2 = captain.location.ltd;
        
            const lon2 = captain.location.lng;
           
            const distance = getDistanceFromLatLonInKm(ltd, lng, lat2, lon2);
           console.log("this is distance heree...",distance)
          
           console.log("this is distance in km",distance)
           console.log("this is radius",radius)
            return distance <= radius;
        });

        return nearbyCaptains;
    } catch (error) {
        console.error('Error finding captains by distance:', error);
        throw new Error('Failed to get captains in radius');
    }
};

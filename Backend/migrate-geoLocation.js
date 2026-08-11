
require('dotenv').config(); // Load .env first
const mongoose = require('mongoose');
const connectToDb = require('./db/db');
const captainModel = require('./models/captain.model')


const migrateGeoLocation = async () => {
    try {
        await connectToDb();

        const captains = await captainModel.find({
            'location.ltd': { $exists: true },
            'location.lng': { $exists: true }
        });


        for (const captain of captains) {
            const { ltd, lng } = captain.location;

            if (!ltd || !lng) continue;

            captain.geoLocation = {
                type: 'Point',
                coordinates: [lng, ltd] // [longitude, latitude]
            };

            await captain.save();
        }

        process.exit();
    } catch (err) {
        console.error('❌ Migration error:', err);
        process.exit(1);
    }
};

migrateGeoLocation();
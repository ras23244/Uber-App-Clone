const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstname,
    lastname,
    email,
    password,
    color,
    plate,
    capacity,
    vehicleType,
}) => {
    if (!firstname || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    const captain = captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    });
    return captain;
};

module.exports.updateCaptainLocation = async (captainId, coordinates) => {
  try {
    const updatedCaptain = await captainModel.findByIdAndUpdate(
      captainId,
      { location: coordinates },
      { new: true }
    );
    return updatedCaptain;
  } catch (err) {
    throw new Error('Failed to update captain location: ' + err.message);
  }
};

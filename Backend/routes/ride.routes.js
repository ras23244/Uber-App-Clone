const express = require('express');
const router = express.Router();
const {body, query} = require('express-validator')
const rideController = require('../controllers/ride.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({min:3}).withMessage('Invalid address'),
    body('destination').isString().isLength({min:3}).withMessage('Invalid address'),
    body('vehicleType').isString().isIn(['auto','car','bike']).withMessage('Invalid Vehicle type'),
    rideController.createRide
)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({min:3}).withMessage('Invalid address'),
    query('destination').isString().isLength({min:3}).withMessage('Invalid address destination'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isString().withMessage('Invalid ride id'),
    query('otp').isString().isLength({min:6, max:6}).withMessage('Invalid otp'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride id'),
    rideController.endRide
)

module.exports=router
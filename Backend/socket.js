const { Server } = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');

let io;
async function persistCaptainLocation(captainId, location) {
    await captainModel.findByIdAndUpdate(captainId, {
        location: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
        }
    });

    console.log(
        `[gps] MongoDB location persisted for captain ${captainId}:`,
        location
    );
}

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('join', async (data, acknowledge) => {
            try {
                const { userId, type } = data;

                if (!userId || !type) {
                    console.error('Invalid join data:', data);
                    acknowledge?.({ ok: false, message: 'Invalid join data' });
                    return;
                }

                // Keep the ID room for compatibility and direct delivery by socket ID.
                socket.join(userId);
                console.log(`[socket] ${socket.id} joined room ${userId}`);

                if (type === 'user') {

                    await userModel.findByIdAndUpdate(
                        userId,
                        {
                            socketId: socket.id
                        }
                    );

                    console.log(
                        `User ${userId} joined with socket ${socket.id}`
                    );
                    acknowledge?.({ ok: true, type: 'user', socketId: socket.id });
                }

                else if (type === 'captain') {

                    const captain =
                        await captainModel.findByIdAndUpdate(
                            userId,
                            {
                                socketId: socket.id,
                                status: 'active'
                            },
                            {
                                new: true
                            }
                        );

                    if (!captain) {
                        console.error(
                            `Captain not found: ${userId}`
                        );
                        return;
                    }

                    console.log(
                        `Captain ${userId} is now ACTIVE`
                    );

                    console.log(
                        `Captain socket ID: ${socket.id}`
                    );

                    console.log(
                        `Captain status: ${captain.status}`
                    );
                    acknowledge?.({ ok: true, type: 'captain', socketId: socket.id });
                }

                else {
                    console.error(
                        'Invalid type provided:',
                        type
                    );
                }

            } catch (error) {
                console.error(
                    'Error in socket join:',
                    error
                );
                acknowledge?.({ ok: false, message: error.message });
            }
        });

        socket.on(
            'update-location-captain',
            async (data) => {

                try {

                    const {
                        userId,
                        location
                    } = data;

                    // Validate data
                    if (
                        !userId ||
                        !location ||
                        typeof location.lat !== 'number' ||
                        typeof location.lng !== 'number'
                    ) {

                        console.error(
                            'Invalid captain location:',
                            data
                        );

                        return socket.emit(
                            'error',
                            {
                                message:
                                    'Invalid location data provided'
                            }
                        );
                    }

                    // Validate coordinate ranges
                    if (
                        location.lat < -90 ||
                        location.lat > 90 ||
                        location.lng < -180 ||
                        location.lng > 180
                    ) {

                        console.error(
                            'Invalid coordinates:',
                            location
                        );

                        return socket.emit(
                            'error',
                            {
                                message:
                                    'Invalid latitude or longitude'
                            }
                        );
                    }

                    const captainLocation = {
                        lat: location.lat,
                        lng: location.lng
                    };

                    console.log(
                        `[gps] received from captain ${userId}:`,
                        captainLocation
                    );

                    // =========================
                    // ACTIVE RIDE LOCATION
                    // =========================

                    const activeRide =
                        await rideModel
                            .findOne({
                                captain: userId,
                                status: {
                                    $in: ['accepted', 'ongoing']
                                }
                            })
                            .populate('user');

                    if (activeRide?.user?.socketId) {
                        console.log(
                            `[gps] sending captain-location-update to passenger socket `
                            + `${activeRide.user.socketId}`
                        );
                        io.to(activeRide.user.socketId).emit(
                            'captain-location-update',
                            captainLocation
                        );
                        console.log(
                            `[gps] captain-location-update emitted for captain ${userId}`
                        );
                    }

                    // Temporary test mode: persist every GPS update.
                    persistCaptainLocation(userId, captainLocation)
                        .catch((error) => {
                            console.error(
                                '[gps] failed to persist captain location:',
                                error
                            );
                        });

                } catch (error) {

                    console.error(
                        'Error updating captain location:',
                        error
                    );

                }

            }
        );


        // =========================
        // DISCONNECT
        // =========================
        socket.on('disconnect', async () => {

            try {

                console.log(
                    `Socket disconnected: ${socket.id}`
                );

                // Find captain using socket ID
                const captain =
                    await captainModel.findOne({
                        socketId: socket.id
                    });

                if (captain) {

                    await captainModel.findByIdAndUpdate(
                        captain._id,
                        {
                            status: 'inactive',
                            socketId: ''
                        }
                    );

                    console.log(
                        `Captain ${captain._id} marked INACTIVE`
                    );
                }

                // Find user using socket ID
                const user =
                    await userModel.findOne({
                        socketId: socket.id
                    });

                if (user) {

                    await userModel.findByIdAndUpdate(
                        user._id,
                        {
                            socketId: ''
                        }
                    );

                    console.log(
                        `User ${user._id} socket cleared`
                    );
                }

            } catch (error) {

                console.error(
                    'Error handling socket disconnect:',
                    error
                );

            }

        });

    });
}


function sendMessageToSocketId(
    socketId,
    messageObject
) {

    if (!io) {

        console.error(
            'Socket.io is not initialized'
        );

        return;
    }

    if (!socketId) {

        console.error(
            'Cannot send socket message: socketId is missing'
        );

        return;
    }

    const targetSocket = io.sockets.sockets.get(socketId);
    if (!targetSocket) {
        console.warn(
            `[socket] ${messageObject.event} skipped; socket is not connected: ${socketId}`
        );
        return;
    }

    console.log(
        `[socket] emitting ${messageObject.event} to connected socket ${socketId}`
    );

    targetSocket.emit(
        messageObject.event,
        messageObject.data
    );

    console.log(
        `[socket] ${messageObject.event} emitted to socket ${socketId}`
    );
}


module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
const { Server } = require('socket.io');
const userModel = require('./models/user.model')
const captainModel = require('./models/captain.model')

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, type } = data;
            socket.join(userId);

            if (type === 'user') {
                const user = await userModel.findByIdAndUpdate(userId, {
                    socketId: socket.id
                });

            } else if (type === 'captain') {
                const captain = await captainModel.findByIdAndUpdate(userId, {
                    socketId: socket.id
                });

            } else {
                console.error('Invalid type provided:', type);
            }
        })

        socket.on('update-location-captain',async (data) =>{
            const {userId, location} = data;

            if (!location || ! location.ltd  || !location.lng) {
                // console.error('Invalid location data provided:', location);
                return socket.emit('error', {message :'Invalid location data provided'});        
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            })
        })

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}

function sendMessageToSocketId(socketId, messageObject) {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.error('Socket.io is not initialized');
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};

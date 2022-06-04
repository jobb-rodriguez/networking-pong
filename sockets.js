let readyPlayerCount = 0;

function listen(io) {
    // const pongNamespace = io.of('/pong');
    // replace ios with pongNamespace
    io.on('connection', (socket) => {
        let room = 'room' + Math.floor(readyPlayerCount / 2);
        console.log('a user connected: ', socket.id);

        socket.on('ready', () => {
            socket.join(room);

            console.log('Player ready', socket.id, room);
            readyPlayerCount++;
            if (readyPlayerCount % 2 === 0) {
                // original had no "in(room)"
                io.in(room).emit('startGame', socket.id);
            }
        })

        socket.on('paddleMove', (paddleData) => {
            // original used broadcast instead of to(room)
            socket.to(room).emit('paddleMove', paddleData);
        });

        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballMove', ballData);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
            socket.leave(room);
        });
    });
}

module.exports = {
    listen
}
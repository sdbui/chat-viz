const express = require('express');
const app = express();
const http = require('http');
const port = 4000;

const cors = require('cors');
app.use(cors());

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

// SOCKETIO STUFF
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});
io.on('connection', (socket) => {
    socket.on('message-send', (msg) => {
        io.sockets.emit('message-add', msg);
    });
});
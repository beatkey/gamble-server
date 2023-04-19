const express = require('express');
const app = express();

const router = require('./src/routes');

app.use(router);

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
});

/*
const app = require("express")();
const http = require("http").createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log(`A ${socket.id} connected.`);

    socket.on("playHandle", (...args) => {
        console.log(args)
    });

    socket.on('disconnect', () => {
        console.log(`A ${socket.id} disconnected.`);
    });
});

// Start the server
http.listen(3001, () => {
    console.log('Server is running...');
});
*/

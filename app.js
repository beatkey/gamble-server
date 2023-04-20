const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser")

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('./src/routes'))

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}!`);
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

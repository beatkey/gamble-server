const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const express = require('express');
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('./src/routes'))

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}!`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    //console.log(`A ${socket.id} connected.`);
    console.log(socket.client.conn.server.clientsCount)
    console.log(socket.rooms)
    //socket.emit("hello", "31");

    socket.on("playHandle", (args, callback) => {
        console.log(args)
        const token = args.token;
        if (!token) {
            callback({
                message: "No token provided!",
                status: false
            })
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
            console.log(err)
            if (err) {
                callback({
                    message: "Token expired.",
                    status: false
                })
            }

            socket.join("room1")
            callback({
                status: true
            })
        });
    });

    socket.on('disconnect', () => {
        //console.log(`A ${socket.id} disconnected.`);
    });
});

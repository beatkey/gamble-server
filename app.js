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

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}!`);
});

const io = require('socket.io')(server, {
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

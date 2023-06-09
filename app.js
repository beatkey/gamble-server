import dotenv from "dotenv"

dotenv.config({path: './.env'});
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload())
app.use('/public', express.static('public'));

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}!`);
});

import socket from "./src/utils/socket.js"

socket(server)

import routes from "./src/routes/index.js"

app.use(routes)

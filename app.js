const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const express = require('express');
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser")

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}!`);
});
require("./src/utils/socket")(server)

app.use(require('./src/routes'))

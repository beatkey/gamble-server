const express = require('express');
const router = express.Router();

const AuthController = require("../controllers/auth")
const {login: loginValidator} = require("../validators/auth")

router.post('/login', loginValidator, AuthController.login);

module.exports = router;

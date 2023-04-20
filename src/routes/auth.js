const express = require('express');
const router = express.Router();

const authJwt = require("../middlewares/auth")

const AuthController = require("../controllers/auth")
const {login: loginValidator} = require("../validators/auth")

router.post('/login', loginValidator, AuthController.login);
router.get('/test-login', [authJwt.verifyToken], (req, res) => {
    res.send("hello")
});

module.exports = router;

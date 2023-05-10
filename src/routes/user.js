const express = require('express');
const router = express.Router();

const UserController = require("../controllers/user")

router.get('/balance', UserController.getBalance);

module.exports = router;

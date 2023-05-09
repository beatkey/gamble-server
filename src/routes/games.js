const express = require('express');
const router = express.Router();

const GamesController = require("../controllers/games")

router.get('/spin-history', GamesController.spinHistory);

module.exports = router;

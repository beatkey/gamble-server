const express = require('express');
const router = express.Router();

const GamesController = require("../controllers/games")

router.get('/spin-history', GamesController.spinHistory);
router.get('/game-history', GamesController.gameHistory);

module.exports = router;

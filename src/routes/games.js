import express from "express";
const router = express.Router();

import {spinHistory, gameHistory} from "../controllers/games.js"

router.get('/spin-history', spinHistory);
router.get('/game-history', gameHistory);

export default router;

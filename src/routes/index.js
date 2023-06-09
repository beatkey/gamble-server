import express from "express";
const router = express.Router();

import authRoutes from "./auth.js"
import gamesRoutes from "./games.js"
import chatRoutes from "./chat.js"

router.use('/auth', authRoutes);
router.use('/games', gamesRoutes);
router.use('/chat', chatRoutes);

export default router

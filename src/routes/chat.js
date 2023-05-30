import express from "express";
const router = express.Router();

import {chatHistory} from "../controllers/chat.js"

router.get('/chat-history', chatHistory);

export default router;

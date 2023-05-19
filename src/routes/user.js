import express from "express";
const router = express.Router();

import {getBalance} from "../controllers/user.js";

router.get('/balance', getBalance);

export default router;

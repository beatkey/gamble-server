import express from "express";
const router = express.Router();

import {verifyToken} from "../middlewares/auth.js"
import {login, register, updateInformation} from "../controllers/auth.js"
import {
    login as loginValidator,
    register as registerValidator,
    updateInformation as updateInformationValidator
} from "../validators/auth.js"

router.post('/login', loginValidator, login);
router.post('/register', registerValidator, register);
router.post('/update-information', updateInformationValidator, updateInformation);
router.get('/test-login', [verifyToken], (req, res) => {
    res.send("hello")
});

export default router;

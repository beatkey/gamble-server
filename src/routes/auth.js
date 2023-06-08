import express from "express";
import {verifyToken} from "../middlewares/auth.js"
import {login, register, updateInformation, getBalance, getUser} from "../controllers/auth.js"
import {
    login as loginValidator,
    register as registerValidator,
    updateInformation as updateInformationValidator
} from "../validators/auth.js"

const router = express.Router();

router.post('/login', loginValidator, login);
router.post('/register', registerValidator, register);
router.post('/update-information', updateInformationValidator, updateInformation);
router.get('/balance', getBalance);
router.get('/user', getUser);
router.get('/test-login', [verifyToken], (req, res) => {
    res.send("hello")
});

export default router;

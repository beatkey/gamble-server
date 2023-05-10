const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const gamesRoutes = require('./games');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/games', gamesRoutes);
router.use('/user', userRoutes);

module.exports = router;

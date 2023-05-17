const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const Users = require('../models/users');
const Games = require('../models/games');
const GamePlayers = require('../models/game_players');

async function initialize() {
    try {
        await Users.sync();
        await Games.sync();
        await GamePlayers.sync();
        console.log('Table created!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

initialize();

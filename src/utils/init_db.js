import dotenv from "dotenv";
dotenv.config({path: './.env'});

import {Users} from "../models/users.js";
import {Games} from "../models/games.js";
import {GamePlayers} from "../models/game_players.js";

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

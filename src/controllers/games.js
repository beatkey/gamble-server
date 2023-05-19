import jwt from "jsonwebtoken";

import {Games} from "../models/games.js";
import {GamePlayers} from "../models/game_players.js";

const spinHistory = (req, res) => {
    Games.spinHistory((err, data) => {
        if (!err)
            res.send({
                statusCode: 200,
                data: data,
            });
        else {
            res.status(500).send({
                statusCode: 500,
                message: e.message,
            });
        }
        ;
    });
}

const gameHistory = (req, res) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }

        //console.log(decoded)

        GamePlayers.findAll({
            //include: Games,
            where: {
                user_id: decoded.id
            }
        }).then(data => {
            //console.log(data)
            res.send(data)
        }).catch(e => {
            res.status(500).send({
                error: e
            })
        })


    });
}

export {
    spinHistory,
    gameHistory
}

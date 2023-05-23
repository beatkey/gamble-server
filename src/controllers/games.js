import jwt from "jsonwebtoken";

import {Games} from "../models/games.js";
import {GamePlayers} from "../models/game_players.js";
import {getPagination, getPagingData} from "../utils/pagination.js";

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
    });
}

const gameHistory = (req, res) => {
    const token = req.headers["x-access-token"];
    const { page } = req.query;
    const size = 10

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

        const { limit, offset } = getPagination(page, size);

        GamePlayers.findAndCountAll({
            limit,
            offset,
            attributes: ["color", "amount", "createdAt"],
            include: {
                model: Games,
                attributes: ["number"]
            },
            where: {
                user_id: decoded.id
            },
            order: [
                ["createdAt", "DESC"]
            ]
        }).then(data => {
            res.send(getPagingData(data, page, limit))
        }).catch(e => {
            console.error(e)
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

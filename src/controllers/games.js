const Games = require("../models/games")
const GamePlayers = require("../models/game_players")
const jwt = require("jsonwebtoken");

exports.spinHistory = (req, res) => {
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

exports.gameHistory = (req, res) => {
    console.log(req.body)
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

        console.log(decoded)

        GamePlayers.findAll({
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

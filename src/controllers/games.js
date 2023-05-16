const Games = require("../models/games")
const GamePlayers = require("../models/game_players")

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

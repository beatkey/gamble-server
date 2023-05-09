const Games = require("../models/games")

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

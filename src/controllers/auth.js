const Users = require("../models/users")

const getUsers = (req, res) => {
    Users.getAll((err, data) => {
        if (!err)
            res.send({
                statusCode: 200,
                message: 'Successfully retrieved all the users.',
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

const login = (req, res) => {
    Users.getAll((err, data) => {
        if (!err)
            res.send({
                statusCode: 200,
                message: 'Successfully retrieved all the users.',
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

module.exports = {
    getUsers,
    login
}

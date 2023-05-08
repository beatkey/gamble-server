const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")

const Users = require("../models/users")

exports.getUsers = (req, res) => {
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

exports.login = (req, res) => {
    const {email, password} = req.body

    Users.findByEmail(email , (err, data) => {
        if (!err){
            if (data){
                const passwordIsValid = bcrypt.compareSync(
                    password,
                    data.password
                );

                if (passwordIsValid){
                    const expiresIn = 86400 // 24 hours
                    const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET_KEY, {
                        expiresIn: expiresIn
                    });

                    res.send({
                        message: 'Successfully login.',
                        data: {
                            token,
                            accessTokenExpiry: new Date().getTime() + expiresIn * 1000, // 24 hours
                            name: data.name,
                            surname: data.surname,
                            email: data.email,
                            balance: data.balance
                        },
                    });
                }else{
                    res.status(401).send({
                        message: "Invalid username or password",
                    });
                }
            }else{
                res.status(401).send({
                    message: "Invalid username or password",
                });
            }
        }
        else {
            res.status(500).send({
                message: err,
            });
        }
    })
}

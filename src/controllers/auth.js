import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import {Users} from "../models/users.js";
import {fileDelete, fileUpload} from "../utils/file.js"

const login = (req, res) => {
    const {email, password} = req.body

    Users.findByEmail(email, (err, data) => {
        if (!err) {
            if (data) {
                const passwordIsValid = bcrypt.compareSync(
                    password,
                    data.password
                );

                if (passwordIsValid) {
                    const expiresIn = 86400 // 24 hours
                    const token = jwt.sign({id: data.id, email: data.email}, process.env.JWT_SECRET_KEY, {
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
                } else {
                    res.status(403).send({
                        message: "Invalid username or password",
                    });
                }
            } else {
                res.status(403).send({
                    message: "Invalid username or password",
                });
            }
        } else {
            res.status(500).send({
                message: err,
            });
        }
    })
}

const register = async (req, res) => {
    //console.log(req.body)
    const {name, surname, email, password} = req.body

    const existingRecord = await Users.findOne({
        where: {
            email: email
        }
    });

    if (!existingRecord) {
        await Users.create({
            name,
            surname,
            email,
            password: bcrypt.hashSync(password, 8),
            balance: 100000
        }).then(() => {
            res.status(200).send({})
        }).catch(e => {
            console.error('Failed to create a new record : ', e);
        });
    } else {
        res.status(403).send({
            error: "Email is exists.",
        });
    }
}

const updateInformation = (req, res) => {
    const token = req.headers["x-access-token"];
    const {name, surname, email, password} = req.body

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }

        const data = {
            name,
            surname: surname,
        }

        if (password.length >= 6) {
            data.password = bcrypt.hashSync(password, 8)
        }

        const photo = req.files ? req.files.photo : null;
        if (photo) {
            const upload = fileUpload(photo, "photo")
            if (!upload.status) {
                return res.status(400).send({
                    message: upload.message
                })
            } else {
                const user = await Users.findOne({
                    where: {
                        id: decoded.id,
                        email
                    }
                })

                if (user.photo){
                    fileDelete(user.photo)
                }

                data.photo = upload.filePath
            }
        }

        Users.update(data, {
            where: {
                id: decoded.id,
                email
            }
        }).then(() => {
            res.status(200).send({});
        }).catch(e => {
            console.error(e)
            res.status(500).send({
                message: e
            });
        });
    });
}

const getBalance = (req, res) => {
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

        Users.getBalance(decoded.id, (err, data) => {
            if (!err)
                res.send({
                    statusCode: 200,
                    data: data,
                });
            else {
                res.status(500).send({
                    statusCode: 500,
                    message: err,
                });
            }
        });
    });
}

export {
    login,
    register,
    updateInformation,
    getBalance
}

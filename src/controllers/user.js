import {Users} from "../models/users.js";
import jwt from "jsonwebtoken";

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

        Users.getBalance(decoded.id,(err, data) => {
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
    getBalance
}

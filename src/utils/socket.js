import {Sequelize} from "sequelize";
import jwt from "jsonwebtoken"
import {Server} from "socket.io";

import {Games} from "../models/games.js"
import {Users} from "../models/users.js"
import {GamePlayers} from "../models/game_players.js"
import {Chat} from "../models/chat.js";
import joi from "joi";

export default function Socket(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    })

    let gameID = null;
    const raffleTime = 15000 // TODO
    const spinTime = 15 // TODO
    let time = spinTime

    let players = {
        red: [],
        green: [],
        black: []
    }

    const spinRange = {
        /*
        * 2 = -9deg - 14.3deg
        * 8 = 15deg - 38.2deg
        * 1 = 39.2deg - 62.3deg
        * 0 = 63.2deg - 86.2deg
        * 14 = 86.9deg - 110.6deg
        * 7 = 111.6deg - 134.4deg
        * 13 = 135.6deg - 158.6deg
        * 6 = 160deg - 182.7deg
        * 12 = 184deg - 206.8deg
        * 5 = 208.2deg - 230.8deg
        * 11 = 232.2deg - 254.8deg
        * 4 = 256.4deg - 278.7deg
        * 10 = 280deg - 302.6deg
        * 3 = 304deg - 326.3deg
        * 9 = 327.7deg - 350.2deg
        * 0 = green, 1-7 = red, 8-14 = black
        * */
        0: [63.2, 86.2],
        1: [39.2, 62.3],
        2: [-9, 14.3],
        3: [304, 326.3],
        4: [256.4, 278.7],
        5: [208.2, 230.8],
        6: [160, 182.7],
        7: [111.6, 134.4],
        8: [15, 38.2],
        9: [327.7, 350.2],
        10: [280, 302.6],
        11: [232.2, 254.8],
        12: [184, 206.8],
        13: [135.6, 158.6],
        14: [86.9, 110.6],
    }

    function start() {
        Games.create().then(res => {
            gameID = res.id
            console.log("Game started ID:" + gameID)
            const timer = setInterval(() => {
                if (time > 0) {
                    console.log("Time: ", time)
                    time--
                } else {
                    console.log("Spinning...")
                    spin()
                    clearInterval(timer)
                    time = 0
                }
                io.emit("getGameTime", time);
            }, 1000)
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });
    }

    start()

    function spinReset() {
        time = spinTime
    }

    function spin() {
        const randomNumber = Math.floor(Math.random() * 15);
        const min = spinRange[randomNumber][0]
        const max = spinRange[randomNumber][1]
        const range = parseFloat((Math.random() * (max - min) + min).toFixed(1))

        Games.update({
            number: randomNumber,
        }, {
            where: {
                id: gameID
            }
        }).then(res => {
            console.log(`Game ended ID: ${gameID} Number: ${randomNumber}`)

            io.emit("spin", {
                randomNumber,
                range,
                raffleTime
            });

            setTimeout(async () => {
                await giveEarnings(randomNumber)
                await spinReset(range)
                await start()
            }, raffleTime)
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });
    }

    const giveEarnings = async (randomNumber) => {
        if (randomNumber > 0 && randomNumber <= 7) { // red
            for (const value of players.red) {
                try {
                    await Users.update(
                        {balance: Sequelize.literal(`balance + ${value.amount * 2}`)},
                        {where: {id: value.id}}
                    );
                } catch (e) {
                    throw new Error(e)
                }
            }
        } else if (randomNumber > 7 && randomNumber <= 14) { // black
            for (const value of players.black) {
                try {
                    await Users.update(
                        {balance: Sequelize.literal(`balance + ${value.amount * 2}`)},
                        {where: {id: value.id}}
                    );
                } catch (e) {
                    throw new Error(e)
                }
            }
        } else { // green
            for (const value of players.green) {
                try {
                    await Users.update(
                        {balance: Sequelize.literal(`balance + ${value.amount * 14}`)},
                        {where: {id: value.id}}
                    );
                } catch (e) {
                    throw new Error(e)
                }
            }
        }

        players = {
            red: [],
            green: [],
            black: []
        }
        io.emit("updatePlayers", players);
    }

    function playHandle(user, color, amount, callback) {
        GamePlayers.create({
            game_id: gameID,
            user_id: user.id,
            color: color,
            amount: amount
        }).catch((err) => {
            callback({
                message: err,
                status: false
            })
        });

        Users.setBalance({
            id: user.id,
            balance: user.balance - amount
        }, (err, data) => {
            if (!err) {
                io.emit("updatePlayers", players);
                callback({
                    status: true
                })
            } else {
                callback({
                    message: err,
                    status: false
                })
            }
        })
    }

    io.on('connection', (socket) => {
        //console.log(`A ${socket.id} connected.`);

        socket.on("updatePlayers", (callback) => {
            callback(players)
        })

        socket.on("playHandle", ({token, amount, color}, callback) => {
            if (time <= 1) {
                callback({
                    status: false
                })
                return;
            }
            if (!token) {
                callback({
                    message: "No token provided!",
                    code: "NO_TOKEN_PROVIDED",
                    status: false
                })
                return
            }

            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    callback({
                        message: "Token expired. You have to login again.",
                        code: "TOKEN_EXPIRED",
                        status: false
                    })
                    return
                }

                Users.findByID(decoded.id, (err, data) => {
                    if (!err) {
                        if (data) {
                            if (data.balance >= parseInt(amount)) {
                                switch (color) {
                                    case "red":
                                        if (!players.red.find(value => value.id === data.id)) {
                                            players.red.push({
                                                id: data.id,
                                                name: data.name,
                                                color,
                                                amount
                                            })

                                            playHandle(data, color, amount, callback)
                                        }
                                        break
                                    case "green":
                                        if (!players.green.find(value => value.id === data.id)) {
                                            players.green.push({
                                                id: data.id,
                                                name: data.name,
                                                color,
                                                amount
                                            })

                                            playHandle(data, color, amount, callback)
                                        }
                                        break
                                    case "black":
                                        if (!players.black.find(value => value.id === data.id)) {
                                            players.black.push({
                                                id: data.id,
                                                name: data.name,
                                                color,
                                                amount
                                            })

                                            playHandle(data, color, amount, callback)
                                        }
                                        break
                                }
                            } else {
                                callback({
                                    message: "Balance is not enough",
                                    code: "BALANCE_NOT_ENOUGH",
                                    status: false
                                })
                            }
                        } else {
                            callback({
                                message: "User error",
                                status: false
                            })
                        }
                    } else {
                        callback({
                            message: err,
                            status: false
                        })
                    }
                })
            });
        });

        socket.on("message", ({token, message}, callback) => {
            const schema = joi.object({
                message: joi.string().required().min(2).max(100),
            });

            const {error} = schema.validate({message});

            if (error) {
                callback({
                    message: error.details[0].message,
                    status: false
                })
                return
            }

            if (!token) {
                callback({
                    message: "No token provided!",
                    code: "NO_TOKEN_PROVIDED",
                    status: false
                })
                return
            }

            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    callback({
                        message: "Token expired. You have to login again.",
                        code: "TOKEN_EXPIRED",
                        status: false
                    })
                    return
                }

                Users.findByID(decoded.id, (err, data) => {
                    if (!err) {
                        if (data) {
                            const currentTime = new Date()
                            const hours = currentTime.getHours().toString().padStart(2, '0')
                            const minutes = currentTime.getMinutes().toString().padStart(2, '0')

                            Chat.create({
                                user_id: data.id,
                                message,
                            }).then(() => {
                                io.emit("message", {
                                    name: data.name,
                                    surname: data.surname,
                                    message,
                                    time: hours + ":" + minutes
                                })
                                callback({
                                    status: true
                                })
                            }).catch((err) => {
                                callback({
                                    message: err,
                                    status: false
                                })
                            });
                        } else {
                            callback({
                                message: "User error",
                                status: false
                            })
                        }
                    } else {
                        callback({
                            message: err,
                            status: false
                        })
                    }
                })
            });
        })
    });
}

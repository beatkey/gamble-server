const jwt = require("jsonwebtoken");

const Games = require("../models/games")
const Users = require("../models/users")
const bcrypt = require("bcryptjs");

module.exports = server => {
    io = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    });

    const raffleTime = 3000
    const spinTime = 9999 // TODO
    let time = spinTime

    const players = {
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
        const timer = setInterval(() => {
            if (time > 0) {
                time--
            } else {
                spin()
                clearInterval(timer)
                time = 0
            }
            io.emit("getGameTime", time);
        }, 1000)
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

        io.emit("spin", {
            randomNumber,
            range,
            raffleTime
        });

        setTimeout(() => {
            spinReset(range)
            start()
            giveEarnings(randomNumber)
        }, raffleTime)

        console.log(randomNumber, min, max, range)
    }

    const giveEarnings = (randomNumber) => {
        console.log(randomNumber)
        let color = "";
        if (randomNumber > 0 && randomNumber <= 7) { // red
            color = "red";
            /*setRedPlayers(prevState => {
                prevState.map((value) => {
                    setBalance(prevState => prevState + value.amount * 2)
                })
                return prevState
            })*/
        } else if (randomNumber > 7 && randomNumber <= 14) { // black
            color = "black";
            /*setBlackPlayers(prevState => {
                prevState.map((value) => {
                    setBalance(prevState => prevState + value.amount * 2)
                })
                return prevState
            })*/
        } else { // green
            color = "green";
            /*setGreenPlayers(prevState => {
                prevState.map((value) => {
                    setBalance(prevState => prevState + value.amount * 14)
                })
                return prevState
            })*/
        }

        Games.create({
            number: randomNumber,
            winner_color: color,
        }).then(res => {
            //console.log(res)
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });

        /*setRedPlayers([])
        setBlackPlayers([])
        setGreenPlayers([])*/
    }

    io.on('connection', (socket) => {
        console.log(`A ${socket.id} connected.`);
        //console.log(socket.client.conn.server.clientsCount)
        //console.log(socket.rooms)
        //socket.emit("hello", "31");

        socket.on("playHandle", ({token, amount, color}, callback) => {
            if (!token) {
                callback({
                    message: "No token provided!",
                    status: false
                })
            }

            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    callback({
                        message: "Token expired.",
                        status: false
                    })
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
                                                color,
                                                amount
                                            })

                                            Users.setBalance({
                                                id: data.id,
                                                balance: data.balance - amount
                                            }, (err, data) => {
                                                if (!err){
                                                    callback({
                                                        status: true
                                                    })
                                                }else{
                                                    callback({
                                                        message: err,
                                                        status: false
                                                    })
                                                }
                                            })
                                        }
                                        break
                                    case "green":
                                        if (!players.green.find(value => value.id === data.id)) {
                                            players.green.push({
                                                id: data.id,
                                                color,
                                                amount
                                            })

                                            Users.setBalance({
                                                id: data.id,
                                                balance: data.balance - amount
                                            }, (err, data) => {
                                                if (!err){
                                                    callback({
                                                        status: true
                                                    })
                                                }else{
                                                    callback({
                                                        message: err,
                                                        status: false
                                                    })
                                                }
                                            })
                                        }
                                        break
                                    case "black":
                                        if (!players.black.find(value => value.id === data.id)) {
                                            players.black.push({
                                                id: data.id,
                                                color,
                                                amount
                                            })

                                            Users.setBalance({
                                                id: data.id,
                                                balance: data.balance - amount
                                            }, (err, data) => {
                                                if (!err){
                                                    callback({
                                                        status: true
                                                    })
                                                }else{
                                                    callback({
                                                        message: err,
                                                        status: false
                                                    })
                                                }
                                            })
                                        }
                                        break
                                }
                            } else {
                                callback({
                                    message: "Balance is not enough",
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
    });
}

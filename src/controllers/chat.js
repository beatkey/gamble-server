import {Chat} from "../models/chat.js";

const chatHistory = (req, res) => {
    Chat.chatHistory((err, data) => {
        if (!err) {
            const updatedData = data.map(value => {
                const time = value.createdAt
                const hours = time.getHours().toString().padStart(2, '0')
                const minutes = time.getMinutes().toString().padStart(2, '0')

                return {
                    name: value.user.name,
                    surname: value.user.surname,
                    message: value.message,
                    time: hours + ":" + minutes
                }
            })

            res.send({
                statusCode: 200,
                data: updatedData.reverse(),
            });
        }else {
            res.status(500).send({
                statusCode: 500,
                message: e.message,
            });
        }
    });
}

export {
    chatHistory
}

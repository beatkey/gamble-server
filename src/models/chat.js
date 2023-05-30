import {DataTypes} from "sequelize";
import sequelize from "../utils/sequelize.js"
import {Users} from "./users.js";

export const Chat = sequelize.define("chat", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
    }
});

Chat.chatHistory = (result) => {
    Chat.findAll({
        limit: 30,
        order: [
            ["createdAt", "DESC"]
        ],
        include: {
            model: Users,
            attributes: ["name", "surname"]
        },
    }).then(res => {
        result(null, res);
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
}

Chat.belongsTo(Users, {
    foreignKey: "user_id",
})

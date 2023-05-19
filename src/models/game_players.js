import {DataTypes} from "sequelize";
import sequelize from "../utils/sequelize.js";
import {Games} from "./games.js";

export const GamePlayers = sequelize.define("game_players", {
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

GamePlayers.belongsTo(Games, {
    foreignKey: "game_id",
})

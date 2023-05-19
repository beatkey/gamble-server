import {DataTypes, Op} from "sequelize";
import sequelize from "../utils/sequelize.js"

export const Games = sequelize.define("games", {
    number: {
        type: DataTypes.INTEGER(2),
        allowNull: true,
        defaultValue: null
    }
});

Games.spinHistory = (result) => {
    Games.findAll({
        limit: 10,
        order: [
            ["createdAt", "DESC"]
        ],
        where: {
            number: {
                [Op.not]: null
            }
        }
    }).then(res => {
        result(null, res);
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
}

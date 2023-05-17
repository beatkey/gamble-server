const { DataTypes, Op } = require("sequelize");

const sequelize = require("../utils/sequelize")

const Table = sequelize.define("games", {
    number: {
        type: DataTypes.INTEGER(2),
        allowNull: true,
        defaultValue: null
    }
});

Table.spinHistory = (result) => {
    Table.findAll({
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

module.exports = Table

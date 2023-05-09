const { DataTypes } = require("sequelize");

const sequelize = require("../utils/sequelize")

const Table = sequelize.define("games", {
    number: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    winner_color: {
        type: DataTypes.STRING(5),
        allowNull: false
    }
});

sequelize.sync().then(() => {
    console.log('Games table created successfully!');

}).catch((error) => {
    console.error('Unable to create table : ', error);
});

Table.spinHistory = (result) => {
    Table.findAll({
        limit: 10,
        order: [
            ["createdAt", "DESC"]
        ]
    }).then(res => {
        result(null, res);
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
}

module.exports = Table

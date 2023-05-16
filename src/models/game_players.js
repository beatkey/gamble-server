const {DataTypes} = require("sequelize");

const sequelize = require("../utils/sequelize")

const Table = sequelize.define("game_players", {
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

module.exports = Table

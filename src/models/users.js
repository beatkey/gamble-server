const bcrypt = require("bcryptjs")
const {Sequelize, DataTypes} = require("sequelize");

const sequelize = require("../utils/sequelize")

const Table = sequelize.define("users", {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0
    }
});

sequelize.sync().then(() => {
    console.log('Users table created successfully!');

    /*Users.create({
        name: "John",
        surname: "Doe",
        email: "test@gmail.com",
        password: bcrypt.hashSync("123123", 8),
        balance: 10000
    }).then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to create a new record : ', error);
    });*/

    /*Users.findAll().then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });*/

    /*Users.findOne({
        where: {
            name : "Emre"
        }
    }).then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });*/

    /*Users.destroy({
        where: {
            name: "Emre"
        }
    }).then(() => {
        console.log("Successfully deleted record.")
    }).catch((error) => {
        console.error('Failed to delete record : ', error);
    });*/

}).catch((error) => {
    console.error('Unable to create table : ', error);
});

Table.findByEmail = (email, result) => {
    Table.findOne({
        where: {
            email: email
        }
    }).then(res => {
        result(null, res);
    }).catch(err => {
        console.log("error: ", err);
        result(null, err);
    });
}

Table.findByID = (id, result) => {
    Table.findOne({
        where: {
            id: id
        }
    }).then(res => {
        result(null, res);
    }).catch(err => {
        console.log("error: ", err);
        result(null, err);
    });
}

Table.setBalance = ({id, balance}, result) => {
    Table.update({
        balance
    }, {
        where: {
            id
        }
    }).then(res => {
        result(null, true);
    }).catch(err => {
        console.log("error: ", err);
        result(null, err);
    });
}

module.exports = Table

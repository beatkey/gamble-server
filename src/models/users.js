import {DataTypes} from "sequelize";

import sequelize from "../utils/sequelize.js";

export const Users = sequelize.define("users", {
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
        defaultValue: 0
    }
});

/*sequelize.sync().then(() => {
    console.log('Users table created successfully!');

    Users.create({
        name: "John",
        surname: "Doe",
        email: "test@gmail.com",
        password: bcrypt.hashSync("123123", 8),
        balance: 10000
    }).then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to create a new record : ', error);
    });

}).catch((error) => {
    console.error('Unable to create table : ', error);
});*/

Users.findByEmail = (email, result) => {
    Users.findOne({
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

Users.findByID = (id, result) => {
    Users.findOne({
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

Users.setBalance = ({id, balance}, result) => {
    Users.update({
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

Users.getBalance = (id, result) => {
    Users.findOne({
        where: {
            id: id
        }
    }).then(res => {
        if (res){
            result(null, res.balance);
        }else{
            result("User not found");
        }
    }).catch(err => {
        console.log("error: ", err);
        result(null, err);
    });
}

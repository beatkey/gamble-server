const db = require("../utils/db")

const Users = (user) => {}

Users.getAll = result => {
    db.query("SELECT * FROM users", (err, res) => {
        if (err) {
            console.log("error", err);
            result(null, err);
            return;
        }

        result(null, res);
    })
}

module.exports = Users

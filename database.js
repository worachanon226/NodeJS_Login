const mysql = require("mysql2")
const dbConnecttion = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "nodejs_login"
}).promise()

module.exports = dbConnecttion
const mysql = require("mysql2");


const pool = mysql.createPool({
    host : `localhost`,
    user : "root",
    password : "",
    database : "brides_furnishings",
    multipleStatements : true
})

module.exports = pool
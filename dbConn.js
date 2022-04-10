const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    password: "password",
    host: "localhost",
    port: process.env.DB_PORT,
    database: process.env.DB_NAME

})

module.exports = pool;
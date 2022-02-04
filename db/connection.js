const mysql = require('mysql2');

// connect to a database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'NEW_USER_PASSWORD',
        database: 'happymart'
    },
    console.log('Connected to database.')
)

module.exports = db;
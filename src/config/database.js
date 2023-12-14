const { connect } = require('mssql');
// const mysql = require('mysql');
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host :'localhost',
    user: 'root',
    // password: '123456',
    database: 'btl2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection; 
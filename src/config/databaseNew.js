const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'btldatabase231',
    server: 'localhost',
    database: 'BTL2',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }
}

module.exports = config;
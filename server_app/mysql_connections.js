var mysql = require ('mysql');

function Connection () {
    this.pool = null;

    this.init = function () {
        this.pool = mysql.createPool ({
            connectionLimit: 10,
            host: '',
            port: '',
            user: '',
            password: '',
            database: ''
        });
    };

    this.acquire = function (callback) {
        this.pool.getConnection (function (err, connection) {
            callback (err, connection);
        });
    };
}

module.exports = new Connection ();
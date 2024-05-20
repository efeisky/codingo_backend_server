const pool = require('./connection');

module.exports.testConnect = async function () {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Error getting connection from pool:", err);
                reject({ dbStatus: 0 });
                return;
            }
            connection.release();
            resolve({ dbStatus: 1 });
        });
    });
}

const pool = require('./connection')

module.exports.testConnect = async function () {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            reject({ dbStatus: 0 });
          }
          connection.release();
          resolve({ dbStatus: 1 });
        });
      });
      
}

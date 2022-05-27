var mysql = require('mysql');
var mariadb = require('mariadb');
 
// Create a connection pool
var pool = 
  mariadb.createPool({
    host: "localhost", 
    port: 3000,
    user: "root", 
    password: "",
    database: "e-cia"
  });

// Create a connection
var conn = 
  mysql.createConnection({
    host: "localhost", 
    port: "3306",
    user: "root", 
    password: "",
    database: "ecia"
  });

conn.connect(function(err, conn){
    if(err) {
        console.log("MySQL tidak terkoneksi");
        throw err;
    }
    if(conn) console.log("MySQL terkoneksi");
})

// module.exports = pool.getConnection(function(err, connection) {
//     if(err) return console.log('MariaDB terkoneksi');

//     console.log('MariaDB tidak terkoneksi');
// })

module.exports = conn;
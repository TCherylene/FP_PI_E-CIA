const conn = require('../koneksi');
var mysql = require('mysql');

// Transfer
function historyTransfer(id){
    var queryHistory = "SELECT * FROM transaksi WHERE id_pengirim = ? OR id_penerima = ?"
    var tableHistory = [id, id]

    queryHistory = mysql.format(queryHistory, tableHistory)

    conn.query(queryHistory, function(error, rows, fields){
        // for i in rows:
        //     console.log(i)
        console.log(rows);
    })
}

module.exports = historyTransfer
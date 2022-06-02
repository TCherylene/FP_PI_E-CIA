var mysql = require('mysql');
var conn = require('../koneksi');

function cekData(idUser){
    conn.query("SELECT id_client, saldo FROM daftar_client WHERE id_client = ?", [idUser], function (error, rows, fields){
        if(error){
            throw error;
        } else if (rows.length == 1){
            return parseInt(rows[0]);
        }
    })
}

module.exports = cekData
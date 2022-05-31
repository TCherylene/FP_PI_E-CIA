'use strict';

var response = require('../res');
var connection = require('../koneksi');
var parsetoken = require('./parseJWT');
const conn = require('../koneksi');
var mysql = require('mysql');

// menampilkan saldo user
exports.tampilSaldo = function (req, res){
    var token = req.headers.authorization

    var tokenparsed = parsetoken(token)

    var data = tokenparsed.rows[0];

    connection.query('SELECT * FROM daftar_client WHERE id_client = ?', [data.id_client], function(error, rows, fields){
        if(error){
            console.log(error);
        } else {
            res.json({
                user_name: rows[0].user_name,
                saldo: rows[0].saldo
            })
        }
    });
};

// TOP UP - JUMLAH
exports.topUp = function(req,res){
    var token = req.headers.authorization;
    var tokenparsed = parsetoken(token);

    var data = tokenparsed.rows[0];
    var saldo = req.body.saldo;

    if(saldo <= 0){ 
        return res.status(400).json({
            message: "Jumlah top up harus lebih dari Rp 0"
        })
    }

    // update table daftar_client
    var query = ("UPDATE daftar_client SET saldo = daftar_client.saldo + ? WHERE id_client = ?");
    var table = [saldo, data.id_client];

    query = mysql.format(query, table);

    conn.query(query, function(error, result, fields){
        if (error) throw error;

        // Update table top up 
        var queryTopUp = ("INSERT INTO topup(id_client, jumlah_topUp, status) VALUES (?, ?, ?)")
        var dataTopUp = [data.id_client, saldo, true]

        queryTopUp = mysql.format(queryTopUp, dataTopUp)

        conn.query(queryTopUp, function(error, rows, fields){
            if(error) throw error;
        })

        conn.query("SELECT id_client, saldo FROM daftar_client WHERE id_client = ?", [data.id_client], function (error, rows, fields){
            if(error){
                throw error;
            } else {
                res.json({
                    message: "Top up berhasil",
                    saldo: rows[0].saldo
                })
            }
        })
    })
}

// TRANSFER - penerima, jumlah, beritaAcara
exports.transfer = function(req, res){
    var token = req.headers.authorization;
    var tokenparsed = parsetoken(token);

    var dataDatabase = tokenparsed.rows[0];

    var dataPostman = {
        penerima: req.body.penerima,
        jumlah: req.body.jumlah,
        beritaAcara: req.body.beritaAcara
    };

    // Penerima kosong
    if(dataPostman.penerima == ""){
        return res.status(400).json({
            message: "Penerima tidak boleh kosong"
        })
    }

    // Jumlah gaada
    if(dataPostman.jumlah <= 0){
        return res.status(400).json({
            message: "Uang yang ditransfer harus lebih dari Rp 0"
        })
    }

    // Query untuk masukkan ke dalam database transaksi
    var selectReceiver = ("SELECT id_client, user_name FROM daftar_client WHERE user_name = ?");
    var dataSelectReceiver = [dataPostman.penerima];

    selectReceiver = mysql.format(selectReceiver, dataSelectReceiver);

    var queryTransaksi = ("INSERT INTO transaksi(id_pengirim, id_penerima, tanggal, jam, nominal, berita_acara, status) VALUES (?, ?, ?, ?, ?, ?, ?)");

    var DateNow = new Date();
    var currentDate = DateNow.getFullYear() + "/" + (DateNow.getMonth() + 1) + "/" + DateNow.getDate();
    var currentTime = DateNow.getHours() + ":" + DateNow.getMinutes() + ":" + DateNow.getSeconds();
    
    var statusSuccess = true;
    var statusFailed = false;

    conn.query(selectReceiver, function(error, result, fields){
        // Penerima tidak ditemukan
        if(result.length != 1){
            return res.status(400).json({
                message: "Penerima tidak ditemukan"
            })
        }

        var idPengirim = dataDatabase.id_client;
        var idPenerima = result[0].id_client;

        const dataMasukTransaksi = [idPengirim,
                                    idPenerima,
                                    currentDate,
                                    currentTime,
                                    dataPostman.jumlah,
                                    dataPostman.beritaAcara,
                                    statusFailed
                                ]

        queryTransaksi = mysql.format(queryTransaksi, dataMasukTransaksi)

        // Penerima & saldonya ada
        conn.query("SELECT id_client, saldo FROM daftar_client WHERE id_client = ?", [idPengirim], function(error, rows, fields){
            if (error) throw error;
            
            // Penerimanya diri sendiri
            if(idPenerima == idPengirim){
                return res.status(400).json({
                    message: "Tidak dapat mengirim ke diri sendiri"
                })
            }

            // Uangnya kurang
            if (rows[0].saldo < dataPostman.jumlah){
                conn.query(queryTransaksi)
                
                return res.status(400).json({
                    message: "Mohon maaf saldo anda tidak cukup"
                })
            }
            
            // Uangnya cukup
            else if (rows[0].saldo >= dataPostman.jumlah){
                // Mengurangi saldo pengirim
                var querySender = ("UPDATE daftar_client SET saldo = (saldo - ?) WHERE id_client = ?")
                var tableSender = [dataPostman.jumlah, idPengirim]

                querySender = mysql.format(querySender, tableSender)

                conn.query(querySender, function(error, hasil, fields){
                    console.log ("Id_pengirim = " + idPengirim)
                    
                    if(error){
                        throw error;
                    } else {
                        res.json({
                            message: "Transfer berhasil",
                            jumlah: (rows[0].saldo - dataPostman.jumlah)
                        })
                    }
                })

                // Menambah saldo penerima
                var queryReceiver = ("UPDATE daftar_client SET saldo = (saldo + ?) WHERE id_client = ?")
                var tableReceiver = [dataPostman.jumlah, idPenerima]

                queryReceiver = mysql.format(queryReceiver, tableReceiver)

                conn.query(queryReceiver, function(error, rows, fields){
                    if(error) throw error;
                    console.log("Id penerima: " + idPenerima)
                    console.log("Transfer berhasil")
                })

                var queryTransaksiSuccess = ("INSERT INTO transaksi(id_pengirim, id_penerima, tanggal, jam, nominal, berita_acara, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
                var dataTransaksiSuccess = [idPengirim,
                                            idPenerima,
                                            currentDate,
                                            currentTime,
                                            dataPostman.jumlah,
                                            dataPostman.beritaAcara,
                                            statusSuccess
                ]

                queryTransaksiSuccess = mysql.format(queryTransaksiSuccess, dataTransaksiSuccess)
                console.log(queryTransaksiSuccess)

                conn.query(queryTransaksiSuccess)
            }
        })
    })
}

// POST BAYAR 
exports.bayar = function(req, res){
    var token = req.headers.authorization;
    var tokenparsed = parsetoken(token);

    var dataDatabase = tokenparsed.rows[0];
    
}

// GET HISTORY
exports.history = function(req, res){
    var token = req.headers.authorization;
    var tokenparsed = parsetoken(token);

    var dataDatabase = tokenparsed.rows[0];


}
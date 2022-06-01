'use strict';

var response = require('../res');
var parsetoken = require('./parseJWT');
const conn = require('../koneksi');
var mysql = require('mysql');
var historyTransfer = require('../history/historyTransfer')

var error1 = "hello";

function serverErrorResponse(error1, error) {
    return response.serverError(message, error);
}

function successResponse(message, res){
    return response.success(message, res)
}

function userErrorResponse(message, res){
    return response.failed(message, res)
}

// menampilkan saldo user
exports.tampilSaldo = function (req, res){
    var token = req.headers.authorization;
    var data = parsetoken(token)

    conn.query('SELECT * FROM daftar_client WHERE id_client = ?', [data.id_client], function(error, rows, fields){
        if(error){
            return serverErrorResponse(error1, error);
        } else {
            res.json({
                id_user: rows[0].id_client,
                name: rows[0].nama_client,
                pass: rows[0].password,
                email: rows[0].email,
                jumlah: rows[0].saldo,
                nomor_wallet: rows[0].nomor_wallet
            })
        }
    });
};

// TOP UP - JUMLAH
exports.topUp = function(req,res){
    var token = req.headers.authorization;
    var data = parsetoken(token);

    var saldo = req.body.saldo;

    var idTopUp = req.params.id;

    if (idTopUp == data.id_client || data.role == 1){
        if(saldo <= 0){ 
            return userErrorResponse("Saldo top up harus lebih dari 0", res)
        }

        conn.query("SELECT * FROM daftar_client WHERE id_client = ?", [idTopUp], function(error, rows, fields){
            console.log(rows.length)
    
            if (error) return serverErrorResponse(error1, error);
    
            if(rows.length == 0){
                return userErrorResponse("User tidak ditemukan", res)
            }
        })
    
        // update table daftar_client
        var query = ("UPDATE daftar_client SET saldo = daftar_client.saldo + ? WHERE id_client = ?");
        var table = [saldo, idTopUp];

        query = mysql.format(query, table);

        conn.query(query, function(error, result, fields){
            if (error) return serverErrorResponse(error1, error);

            // Insert to table top up 
            var queryTopUp = ("INSERT INTO topup(id_client, jumlah_topUp, status) VALUES (?, ?, ?)")
            var dataTopUp = [idTopUp, saldo, true]

            queryTopUp = mysql.format(queryTopUp, dataTopUp)

            conn.query(queryTopUp, function(error, rows, fields){
                if(error) return serverErrorResponse(error1, error);
            })

            conn.query("SELECT id_client, saldo FROM daftar_client WHERE id_client = ?", [idTopUp], function (error, rows, fields){
                if(error){
                    return serverErrorResponse(error1, error);
                } else {
                    res.json({
                        status: 200,
                        message: "Top up berhasil",
                        id_user: idTopUp,
                        saldo: rows[0].saldo
                    })
                }
            })
        })
    } else {
        return userErrorResponse("Anda tidak dapat mengakses halaman ini", res)
    }
}

// TRANSFER - penerima, jumlah, beritaAcara
exports.transfer = function(req, res){
    var token = req.headers.authorization;
    var dataDatabase = parsetoken(token);

    var dataPostman = {
        penerima: req.body.penerima,
        jumlah: req.body.jumlah,
        beritaAcara: req.body.beritaAcara
    };

    // Penerima kosong
    if(dataPostman.penerima == null){
        return userErrorResponse("Penerima tidak boleh kosong", res)
    }

    // Jumlah gaada
    if(dataPostman.jumlah <= 0){
        return userErrorResponse("Jumlah yang ditransfer harus lebih dari 0", res)
    }

    // Query untuk masukkan ke dalam database transfer
    var selectReceiver = ("SELECT id_client, user_name FROM daftar_client WHERE user_name = ?");
    var dataSelectReceiver = [dataPostman.penerima];

    selectReceiver = mysql.format(selectReceiver, dataSelectReceiver);

    var querytransfer = ("INSERT INTO transfer(id_pengirim, id_penerima, nominal, berita_acara, status) VALUES (?, ?, ?, ?, ?)");

    var statusSuccess = true;
    var statusFailed = false;

    conn.query(selectReceiver, function(error, result, fields){
        if (error) return serverErrorResponse(error1, error)
        
        // Penerima tidak ditemukan
        if(result.length != 1){
            return res.status(400).json({
                message: "Penerima tidak ditemukan"
            })
        }

        var idPengirim = dataDatabase.id_client;
        var idPenerima = result[0].id_client;

        const dataMasuktransfer = [idPengirim,
                                    idPenerima,
                                    dataPostman.jumlah,
                                    dataPostman.beritaAcara,
                                    statusFailed
                                ]

        querytransfer = mysql.format(querytransfer, dataMasuktransfer)

        // Penerima & saldonya ada
        conn.query("SELECT id_client, saldo FROM daftar_client WHERE id_client = ?", [idPengirim], function(error, rows, fields){
            if (error) return serverErrorResponse(error1, error);
            
            // Penerimanya diri sendiri
            if(idPenerima == idPengirim){
                return userErrorResponse("Tidak dapat transfer ke diri sendiri", res);
            }

            // Uangnya kurang
            if (rows[0].saldo < dataPostman.jumlah){
                conn.query(querytransfer)
                
                return userErrorResponse("Saldo anda tidak mencukupi", res)
            }
            
            // Uangnya cukup
            else if (rows[0].saldo >= dataPostman.jumlah){
                // Mengurangi saldo pengirim
                var querySender = ("UPDATE daftar_client SET saldo = (saldo - ?) WHERE id_client = ?")
                var tableSender = [dataPostman.jumlah, idPengirim]

                querySender = mysql.format(querySender, tableSender)

                conn.query(querySender, function(error, hasil, fields){                    
                    if(error){
                        return serverErrorResponse(error1, error);
                    } else {
                        successResponse("Transfer berhasil", res);
                    }
                    })
                }})

                // Menambah saldo penerima
                var queryReceiver = ("UPDATE daftar_client SET saldo = (saldo + ?) WHERE id_client = ?")
                var tableReceiver = [dataPostman.jumlah, idPenerima]

                queryReceiver = mysql.format(queryReceiver, tableReceiver)

                conn.query(queryReceiver, function(error, rows, fields){
                    serverErrorResponse(error1, error);
                })

                // Masukkan ke dalam tabel transfer
                var querytransferSuccess = ("INSERT INTO transfer(id_pengirim, id_penerima, nominal, berita_acara, status) VALUES (?, ?, ?, ?, ?)");
                var datatransferSuccess = [idPengirim,
                                            idPenerima,
                                            dataPostman.jumlah,
                                            dataPostman.beritaAcara,
                                            statusSuccess
                ]

                querytransferSuccess = mysql.format(querytransferSuccess, datatransferSuccess)

                conn.query(querytransferSuccess, function(error, rows, fields){
                    if(error) return serverErrorResponse(error1, error);
                })
        }
)}

// POST BAYAR 
exports.bayar = function(req, res){
    var token = req.headers.authorization;
    var dataDatabase = parsetoken(token);
    
}

// GET HISTORY
exports.history = function(req, res){
    var token = req.headers.authorization;
    var dataDatabase = parsetoken(token);

    var idClient = dataDatabase.id_client

    historyTransfer(idClient)
}
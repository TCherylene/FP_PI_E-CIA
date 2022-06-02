'use strict';

var response = require('../res');
var parsetoken = require('./parseJWT');
const conn = require('../koneksi');
var mysql = require('mysql');
var updateSaldo = require('./update_saldo')
var cekData = require('./cek_data')

var error1 = "hello";
var statusSuccess = true;
var statusFailed = false;

function serverErrorResponse(error1, error) {
    return response.serverError(error1, error);
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
    var idPengirim = data.id_client;

    if (idTopUp == data.id_client || data.role == 1){
        if(saldo <= 0){ 
            return userErrorResponse("Saldo top up harus lebih dari 0", res)
        }

        // User tidak ada
        conn.query("SELECT * FROM daftar_client WHERE id_client = ?", [idTopUp], function(error, rows, fields){
            console.log(rows.length)
    
            if (error) return serverErrorResponse(error1, error);
    
            if(rows.length == 0){
                return userErrorResponse("User tidak ditemukan", res)
            }
        })
    
        updateSaldo(idTopUp, saldo)
        
        // Insert to table top up 
        var queryTopUp = ("INSERT INTO topup(id_client, id_pengirim, jumlah_topUp, status) VALUES (?, ?, ?, ?)")
        var dataTopUp = [idTopUp, idPengirim, saldo, true]

        queryTopUp = mysql.format(queryTopUp, dataTopUp)

        conn.query(queryTopUp, function(error, rows, fields){
            if(error) return serverErrorResponse(error1, error);
            else{
                res.json({
                    status: 200,
                    message: "Top up berhasil",
                    id_user: idTopUp,
                    saldo: cekData(idTopUp).saldo
                })
            }
        })

    } else {
        return userErrorResponse("Anda tidak dapat mengakses halaman ini", res)
    }
}

// TRANSFER - penerima, jumlah
exports.transfer = function(req, res){
    var token = req.headers.authorization;
    var dataDatabase = parsetoken(token);

    var dataPostman = {
        email: req.body.email,
        jumlah: parseInt(req.body.jumlah),
    };

    // Penerima kosong
    if(dataPostman.email == null){
        return userErrorResponse("Penerima tidak boleh kosong", res)
    }

    // Jumlah gaada
    if(dataPostman.jumlah <= 0){
        return userErrorResponse("Jumlah yang ditransfer harus lebih dari 0", res)
    }

    // Query untuk mencari receiver
    var selectReceiver = ("SELECT id_client, email FROM daftar_client WHERE email = ?");
    var dataSelectReceiver = [dataPostman.email];
    
    selectReceiver = mysql.format(selectReceiver, dataSelectReceiver);
    
    // Query untuk masukkan ke dalam database transfer
    var querytransfer = ("INSERT INTO transfer(id_pengirim, id_penerima, nominal, status) VALUES (?, ?, ?, ?)");

    conn.query(selectReceiver, function(error, result, fields){
        if (error) return serverErrorResponse(error1, error)
        
        // Penerima tidak ditemukan
        if(result.length != 1){
            return userErrorResponse("Penerima tidak ditemukan", res)
        }

        var idPengirim = dataDatabase.id_client;
        var idPenerima = result[0].id_client;

        const dataMasuktransfer = [idPengirim,
                                    idPenerima,
                                    dataPostman.jumlah,
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
                updateSaldo(idPengirim, dataPostman.jumlah * (-1));

                // Menambah saldo penerima
                updateSaldo(idPenerima, dataPostman.jumlah);
                
                // Masukkan ke dalam tabel transfer
                var querytransferSuccess = ("INSERT INTO transfer(id_pengirim, id_penerima, nominal, status) VALUES (?, ?, ?, ?);");
                var datatransferSuccess = [idPengirim, idPenerima, dataPostman.jumlah, statusSuccess]
    
                querytransferSuccess = mysql.format(querytransferSuccess, datatransferSuccess)
                
                conn.query(querytransferSuccess, function(error, hasil, fields){
                    if (error) return serverErrorResponse(error1, error);
                    else {
                        return successResponse("Transfer berhasil", res);
                    }
                })
            }
        })
    }
)}

// POST BAYAR 
exports.bayar = function(req, res){
    var token = req.headers.authorization;
    var dataDatabase = parsetoken(token);

    var id_user = req.body.id_user

    // Ambil id user
    if (req.body.id_user == null){
        id_user = dataDatabase.id_client;
    }

    var dataPostman = {
        id_user: id_user,
        nama_barang: req.body.nama_barang,
        harga: parseInt(req.body.harga),
        wallet: req.body.wallet,
        nomor_wallet: req.body.nomor_wallet
    };
    // nama_barang -> layanan
    // wallet: memilih e wallet yang mana
    // nomor wallet: dari get profile
    
    // Barang & harga nya kosong
    if(dataPostman.nama_barang == null || dataPostman.harga == null){
        return userErrorResponse("Nama_barang dan harga tidak boleh kosong", res)
    }

    // Ngecek Nomor Wallet (kalau tidak ada nomor wallet)
    if(dataPostman.nomor_wallet == null){
        return userErrorResponse("Masukkan nomor_wallet", res)
    }
    
    // Query untuk table bayar
    var queryBayar = "INSERT INTO bayar (id_client, nomor_wallet, layanan, jumlah_pembayaran, status) VALUES (?, ?, ?, ?, ?)"
    var tableBayarFailed = [id_user, dataPostman.nomor_wallet, dataPostman.nama_barang, dataPostman.harga, statusFailed]

    var queryBayarFailed = mysql.format(queryBayar, tableBayarFailed);

    // Query untuk ngecek nomor wallet
    var queryWallet = "SELECT id_client, nomor_wallet FROM daftar_client WHERE id_client = ? AND nomor_wallet = ?"
    var dataWallet = [id_user, dataPostman.nomor_wallet]

    var queryWallet = mysql.format(queryWallet, dataWallet);

    conn.query(queryWallet, function(error, rows, next){
        if (error) throw error;
        // nomor wallet salah
        if (rows.length == 0){
            conn.query(queryBayarFailed)

            return userErrorResponse("Nomor wallet salah", res)
        } 

        // nomor wallet benar
        else { 
            updateSaldo(id_user, (-1) * dataPostman.harga)
            var tableBayarSuccess = [id_user, dataPostman.nomor_wallet, dataPostman.nama_barang, dataPostman.harga, statusSuccess]
            var queryBayarSuccess = mysql.format(queryBayar, tableBayarSuccess)
            
            conn.query(queryBayarSuccess, function(error, rows, fields){
                if(error) throw error;
                else{
                    return successResponse("Pembayaran berhasil", res);
                }
            })
        }
    })
}

// GET HISTORY
exports.history = function(req, res){
    var token = req.headers.authorization;
    var dataDatabase = parsetoken(token);

    var idClient = dataDatabase.id_client

    // // Transfer
    // var queryHistoryTransfer = "SELECT * FROM transfer WHERE id_pengirim = ? OR id_penerima = ?"
    // var tableHistoryTransfer = [idClient, idClient]

    // queryHistoryTransfer = mysql.format(queryHistoryTransfer, tableHistoryTransfer)
    
    // conn.query(queryHistoryTransfer, function(error, rows, fields){
    //     if (error) throw error;

    //     if(rows.length == 0){
    //         res.status(200).json({
    //             status: 200,
    //             message: "Tidak ada data"
    //         })
    //     }

    //     console.log(rows);
    // })

    // Bayar
    var queryHistoryBayar = "SELECT id_client, nomor_wallet, layanan, jumlah_pembayaran, tanggal, waktu, status  FROM bayar WHERE id_client = ?"
    var tableHistoryBayar = [idClient]

    queryHistoryBayar = mysql.format(queryHistoryBayar, tableHistoryBayar)

    conn.query(queryHistoryBayar, function(error, rows, fields){
        if(error) throw error;

        if(rows.length == 0){
            res.status(200).json({
                status:200,
                message: "Tidak ada data"
            })
        }

        let data = rows
        
        // empty array to store the data
        let testData = [];
        data.forEach(element => {
              testData.push(element)
        });

        console.log(testData)
    })
}
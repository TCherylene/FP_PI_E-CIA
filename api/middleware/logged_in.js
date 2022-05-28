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
                user_name: data.id_client,
                saldo: data.saldo
            })
        }
    });
};

// TOP UP
exports.topUp = function(req,res){
    var token = req.headers.authorization;
    var tokenparsed = parsetoken(token);

    var data = tokenparsed.rows[0];
    var saldo = req.body.saldo;

    if(saldo <= 0){ 
        return res.status(400).json({
            message: "Masukkan jumlah saldo yang benar"
        })
    }

    var query = ("UPDATE daftar_client SET saldo = daftar_client.saldo + ? WHERE id_client = ?");
    var table = [saldo, data.id_client];

    query = mysql.format(query, table);

    conn.query(query, function(error, rows, fields){
        if(error){
            throw error;
        } else {
            res.json({
                message: "Top up berhasil"
            })
        }
    })
}


// //menampilkan semua data mahasiswa
// exports.tampilsemuamahasiswa = function (req, res) {
//     connection.query('SELECT * FROM mahasiswa', function (error, rows, fileds) {
//         if (error) {
//             console.log(error);
//         } else {
//             response.ok(rows, res)
//         }
//     });
// };

// //menampilkan semua data mahasiwa berdasarkan id
// exports.tampilberdasarkanid = function (req, res) {
//     let id = req.params.id;
//     connection.query('SELECT * FROM mahasiswa WHERE id_mahasiswa = ?', [id],
//         function (error, rows, fields) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 response.ok(rows, res);
//             }
//         });
// };

// //menambahkan data mahasiswa
// exports.tambahMahasiswa = function (req, res) {
//     var nim = req.body.nim;
//     var nama = req.body.nama;
//     var jurusan = req.body.jurusan;

//     connection.query('INSERT INTO mahasiswa (nim,nama,jurusan) VALUES(?,?,?)',
//         [nim, nama, jurusan],
//         function (error, rows, fields) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 response.ok("Berhasil Menambahkan Data!", res)
//             }
//         });
// };


// //mengubah data berdasarkan id
// exports.ubahMahasiswa = function (req, res) {
//     var id = req.body.id_mahasiswa;
//     var nim = req.body.nim;
//     var nama = req.body.nama;
//     var jurusan = req.body.jurusan;

//     connection.query('UPDATE mahasiswa SET nim=?, nama=?, jurusan=? WHERE id_mahasiswa=?', [nim, nama, jurusan, id],
//         function (error, rows, fields) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 response.ok("Berhasil Ubah Data", res)
//             }
//         });
// }

// //Menghapus data berdasarkan id
// exports.hapusMahasiswa = function (req, res) {
//     var id = req.body.id_mahasiswa;
//     connection.query('DELETE FROM mahasiswa WHERE id_mahasiswa=?',[id],
//         function (error, rows, fields) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 response.ok("Berhasil Hapus Data", res)
//             }
//         });
// }

// //menampilkan matakuliah group
// exports.tampilgroupmatakuliah = function(req, res){
//     connection.query('SELECT mahasiswa.id_mahasiswa, mahasiswa.nim, mahasiswa.nama, mahasiswa.jurusan, matakuliah.matakuliah, matakuliah.sks from krs JOIN matakuliah JOIN mahasiswa WHERE krs.id_matakuliah = matakuliah.id_matakuliah AND krs.id_mahasiswa = mahasiswa.id_mahasiswa ORDER BY mahasiswa.id_mahasiswa',
//         function (error, rows, fields){
//             if(error){
//                 console.log(error);
//             }else {
//                 response.oknested(rows, res);
//             }
//         }
//     )

// }



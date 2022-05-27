'use strict';

var response = require('./res');
var connection = require('./koneksi');
var verifikasi = require('./middleware/verifikasi')
var jwt_decode = require('jwt-decode');
const express = require('express');
const dotenv = require('dotenv');

exports.index = function (req, res) {
    response.ok("Aplikasi REST API ku berjalan!", res)
};

// menampilkan saldo user
exports.tampilSaldo = function (req, res){
    var token = req.headers.authorization

    var tokenparsed = parseJwt(token)
    var id = tokenparsed.rows.id_client;
    console.log(id)

    connection.query('SELECT * FROM daftar_client WHERE id_client = ?', [id], function(error, rows, fields){
        if(error){
            console.log(error);
        } else {
            res.json({
                // user_name: rows[0].id_client,
                // saldo: rows[0].saldo
            })
        }
    });
};

function parseJwt(token) {
    var base64Payload = token.split('.')[1];
    var payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
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



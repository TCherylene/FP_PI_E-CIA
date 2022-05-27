var connection = require('../koneksi');
var mysql = require('mysql');
var md5 = require('md5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');
var ip = require('ip');

//controller untuk registrasi user
exports.registrasi = function (req, res) {
     var post = {
          name: req.body.name,
          user_name: req.body.user_name,
          password: md5(req.body.password),
          noHP: req.body.noHP,
     }

     var query = "SELECT user_name FROM ?? WHERE ??=?";
     var table = ["daftar_client", "user_name", post.user_name];

     query = mysql.format(query, table);

     connection.query(query, function (error, rows) {
          if (error) {
               console.log(error);
          } else {
               // kalau gaada
               if (rows.length == 0) {
                    var query = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, ?)";
                    var table = [  "daftar_client", 
                                   "nama_client", "user_name", "no_hp", "password",
                                   post.name, post.user_name, post.noHP, post.password];
                    query = mysql.format(query, table);
               } else {
                    res.json({
                         success: false,
                         isRegistered: true,
                         message: "user_name anda telah terdaftar!"
                    }).end();
               }
          }
     })
}

// controller untuk login
exports.login = function (req, res) {
     var post = {
          password: req.body.password,
          user_name: req.body.user_name
     }

     var query = "SELECT ??, ??, ??, ??, ?? FROM ?? JOIN ?? WHERE ??=? AND ??=?";
     var table = [  //SELECT
                    "id_client", "nama_client", "user_name", md5(post.password), saldo,
                    //FROM & JOIN
                    "daftar_client", "saldo", 
                    //WHERE
                    "user_name", post.user_name,
                    "password", post.password];

     query = mysql.format(query, table);

     connection.query(query, function (error, rows) {
          if (error) {
               console.log(error);
          } else {
               if (rows.length == 1) {
                    var token = jwt.sign({ rows }, config.secret, {
                         //ubah expires dalam ms
                         expiresIn: '2400000'
                    });

                    id_user = rows[0].id;
                    //1 tambahan row username
                    username = rows[0].username;

                    // var expired = 30000
                    var expired = 2400000

                    var data = {
                         id_user: id_user,
                         access_token: token,
                         ip_address: ip.address()
                    }

                    var query = "INSERT INTO ?? SET ?";
                    var table = ["akses_token"];

                    query = mysql.format(query, table);
                    connection.query(query, data, function (error, rows) {
                         if (error) {
                              console.log(error);
                         } else {
                              res.json({
                                   success: true,
                                   message: 'Token JWT tergenerate!',
                                   token: token,
                                   //4 tambahkan expired time
                                   expires: expired,
                                   currUser: data.id_user,
                                   user: username,
                              });
                         }
                    });
               }
               else {
                    res.json({ "Error": true, "Message": "Username atau password salah!" });
               }
          }
     });
}

exports.halamanrahasia = function (req, res) {
     response.ok("Halaman ini hanya untuk user dengan role = 2!", res);
}

//menampilkan semua data mahasiswa
exports.adminmahasiswa = function (req, res) {
     connection.query('SELECT * FROM mahasiswa', function (error, rows, fields) {
          if (error) {
               console.log(error);
          } else {
               response.ok(rows, res)
          }
     });
};
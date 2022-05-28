var mysql = require('mysql');
var md5 = require('md5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');
var ip = require('ip');
const conn = require('../koneksi');

//controller untuk registrasi user
exports.registrasi = function (req, res) {
     var post = {
          name: req.body.name,
          user_name: req.body.user_name,
          password: md5(req.body.password),
          noHP: req.body.noHP,
          saldo: 0
     }

     var query = "SELECT user_name FROM ?? WHERE ??=?";
     var table = ["daftar_client", "user_name", post.user_name];

     query = mysql.format(query, table);

     conn.query(query, function (error, rows) {
          if (error) {
               console.log(error);
          } else {
               // kalau gaada
               if (rows.length == 0) {
                    var query = "INSERT INTO daftar_client (nama_client, user_name, no_hp, password, saldo) VALUES (?)";
                    var table = [post.name, post.user_name, post.noHP, post.password, post.saldo];
                    
                    conn.query(query, [table], function(err, result){
                         if(err) console.log("Data gagal ditambahkan");

                         console.log("Data berhasil ditambahkan");
                    }).end()

                    res.json({
                         user_name: post.user_name,
                         message: "Berhasil ditambahkan"
                    })

               } else {
                    res.json({
                         success: false,
                         isRegistered: true,
                         message: "Data telah terdaftar!"
                    }).end();
               }
          }
     })
}

// controller untuk login
exports.login = function (req, res) {
     var post = {
          user_name: req.body.user_name,
          password: md5(req.body.password)
     }

     var query = "SELECT id_client, nama_client, user_name, password, saldo FROM daftar_client WHERE user_name=? AND password=?";
     var table = [post.user_name, post.password];

     query = mysql.format(query, table);

     conn.query(query, function (error, rows) {
          if (error) returnconsole.log(error);

          if (rows.length == 1) {
               var token = jwt.sign({rows}, config.secret);

               res.json({
                    success: true,
                    message: 'Token JWT tergenerate!',
                    token: token,
                    currUser: post.user_name,
                    user: post.user_name
               });
          } else {
               res.json({"Error": true, "Message": "Username atau password salah!"});
          }
     })
};             
 

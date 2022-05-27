var express = require('express');
var auth = require('./auth');
var router = express.Router();
// var verifikation = require('./verification');
var verifikasi = require('./verifikasi')

//daftarkan menu registrasi
router.post('/api/register', auth.registrasi);
router.post('/api/login', auth.login);

// router.get('/verify', auth.verifikasi)

//alamat yang perlu otorisasi
//halaman menampilkan data tabel oleh administrator
//router.get('/api/v1/admin/mahasiswa', verifikasi(1), auth.adminmahasiswa);

module.exports = router;
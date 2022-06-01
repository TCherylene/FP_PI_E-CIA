var express = require('express');
var auth = require('./auth');
var router = express.Router();
var verifikasi = require('./verifikasi')
var jsonku = require('./logged_in');

//daftarkan menu registrasi
router.post('/register', auth.registrasi);
router.post('/login', auth.login);

//alamat yang perlu authentication
router.get('/saldo', verifikasi(), jsonku.tampilSaldo);
router.post('/topup', verifikasi(), jsonku.topUp);
router.post('/transfer', verifikasi(), jsonku.transfer);
router.post('/riwayat', verifikasi(), jsonku.history);
router.post('/bayar', verifikasi(), jsonku.bayar);

module.exports = router;
var express = require('express');
var auth = require('./auth');
var router = express.Router();
var verifikasi = require('./verifikasi')
var jsonku = require('./logged_in');

// Registrasi
router.post('/profile', auth.registrasi);

// Login
router.post('/login', auth.login);

// GET profile - Sebelumnya: saldo
router.get('/profile', verifikasi(), jsonku.tampilSaldo);

// PUT profile - Sebelumnya: top up
router.put('/profile/:id', verifikasi(), jsonku.topUp);


router.post('/transfer', verifikasi(), jsonku.transfer);
router.get('/riwayat', verifikasi(), jsonku.history);

// POST pembelian - Sebelumnya: bayar
router.post('/pembelian', verifikasi(), jsonku.bayar);

module.exports = router;
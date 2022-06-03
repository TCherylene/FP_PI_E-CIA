# API E-CIA

API ini untuk e-money dari kelompok 5 yang bernamakan E-CIA.

API E-CIA tersedia pada: `https://api-ecia.herokuapp.com`

## Endpoints - Without Authentication

Endpoint yang **tidak** memerlukan authentication untuk mengakses

### Register

POST `/profile`

Body (JSON):

- name
- email
- pass

> Untuk mendaftarkan akun di dalam database E-CIA

### Login

POST `/login`

Body (JSON):

- email
- pass

> Untuk masuk/login ke dalam akun yang telah terdaftar

## Endpoints - With Authentication

Endpoint yang memerlukan authentication untuk mengakses. Lakukan [login](#login) untuk mendapatkan token.

Headers:

**Authorization:** `BEARER <token>`

### Cek Profil

GET `/profile`

> Untuk mendapatkan informasi terkait profil user

### Top Up

PUT `/profile/:id`

Body(JSON):

- saldo

> Untuk melakukan top up pada akun user
>
> Parameter `id` berfungsi sebagai user yang menerima top up
>
> - Untuk admin dapat melakukan top up pada user lain & dapat bernilai negatif
> - Untuk user *hanya* dapat melakukan top up pada diri sendiri & harus bernilai positif

### Transfer

POST `/transfer`

Body(JSON):

- email
- jumlah

> Untuk melakukan transfer ke user lain
>
> Body `email` berfungsi sebagai user yang menerima top up
>
> - User dan admin **tidak** dapat melakukan transfer ke diri sendiri
> - Tidak dapat melakukan transfer dengan jumlah <= 0
> - Saldo user dan admin harus melebihi jumlah transfer (Akan gagal jika tidak memenuhi)

### Pembelian

POST `/pembelian`

Body(JSON):

- id_user (opsional)
- nama_barang
- harga
- nomor_wallet

> Untuk melakukan pembelian terhadap suatu produk
>
> Body `nomor_wallet` merupakan nomor rekening user di dalam E-CIA, untuk mendapatkan `nomor_wallet` dapat dilakukan [di sini](#cek-profil)
>
> Selain `id_user`, hal-hal lain bersifat wajib

### Riwayat / History

GET `/riwayat`

> Untuk mendapatkan history apa saja yang telah dilakukan user (pembayaran, transfer, atau top up)

## Responses

Status
| Status | Arti |
| --- | --- |
| 200 | Sukses |
| 400 | Terdapat kesalahan input dari user |
| 500 | Server Error |

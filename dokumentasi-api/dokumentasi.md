# API E-CIA

API ini untuk e-money dari kelompok 5 kelas A yang bernamakan E-CIA.

API E-CIA tersedia pada: `https://api-ecia.herokuapp.com/api`

## Kelompok 5

* Alda Risma Harjian / 5027201004
* Sharira Saniane / 5027201016
* Cherylene Trevina / 50270201033

## Daftar Endpoints

Hal-hal yang bisa dilakukan dalam API E-CIA:

| Method | Endpoint | Dokumentasi | Deskripsi |
| :---: | --- | :---: | --- |
| POST | /profile | [register](#register) | Untuk melakukan registrasi akun |
| POST | /login | [login](#login) | Untuk masuk ke akun dan mendapatkan token |
| GET | /profile | [cek-profil](#cek-profil) |Untuk mendapatkan informasi akun (id, nama, email, pass, jumlah, nomor_wallet) |
| PUT | /profile/:id | [top up](#top-up) | Untuk melakukan top up |
| POST | /pembelian | [pembelian](#pembelian) | Untuk melakukan pembelian (pemesanan) terhadap suatu barang/layanan |
| GET | /pembelian/:id_user | [cek pembelian](#cek-pembelian) | Untuk mengecek status/pembayaran apa saja yang telah dilakukan |
| GET | /pembelian/:id_user/:id_pembelian | [cek pembelian(id)](#cek-pembelian-berdasarkan-id-pembelian) | Untuk mengecek status/pembayaran pada id_pembelian tertentu |
| POST | /transaksi | [transaksi](#transaksi) | Untuk melakukan pembayaran terhadap pembelian yang sudah dilakukan |
| POST | /transfer | [transfer](#transfer) | Untuk melakukan transfer kepada user lain |
| GET | /riwayat | [riwayat](#riwayat--history) | Untuk menampilkan history transaksi |

## Endpoints

### Register

`POST` https://api-ecia.herokuapp.com/api/profile

Properties:

* Params: -
* Authorization: -
* Body (JSON):

| Object | Keterangan |
| --- | --- |
| email | Email yang digunakan untuk mendaftar (tidak boleh sama dengan user lain) |
| pass | Password akun (tidak ada ketentuan) |
| name | Nama dari user (menggunakan **`name`** bukan `nama`)|

#### Contoh: (Email baru)

Body:

```json
{
    "name": "Test",
    "email":"test@test.com",
    "pass": "test1234"
}
```

Response:

```json
{
    "status": 200,
    "message": "Pendaftaran berhasil"
}
```

#### Response yang bisa didapatkan

| Status | Message |
| --- | --- |
| 200 | Pendaftaran berhasil |
| 400 | Email, pass dan name tidak boleh kosong |
| 400 | Email telah terdaftar |
| 500 | Server Error |

---

### Login

`POST` https://api-ecia.herokuapp.com/api/login

Properties:

* Params: -
* Authorization: -
* Body (JSON):

| Object | Keterangan |
| --- | --- |
| email | Email yang digunakan untuk masuk ke E-CIA |
| pass | Password akun (tidak ada ketentuan) |

#### Contoh: (Email ditemukan)

Body:

```json
{
    "email":"test@test.com",
    "pass": "test1234"
}
```

Response:

![email ditemukan](https://user-images.githubusercontent.com/77750276/171910053-38d9e219-8521-4512-8c24-82fd6297688d.png)

#### Response yang dapat diterima

| Status | Message |
| --- | --- |
| 200 | Mendapatkan `token` |
| 400 | Email atau password salah |
| 400 | Email dan pass tidak boleh kosong |
| 500 | Server Error |

---

### Cek Profil

`GET` https://api-ecia.herokuapp.com/api/profile

Properties:

* Params: -
* Authorization: `BEARER <token>`
* Body (JSON): -

Contoh response:

```json
{
    "id_user": 5,
    "name": "Test",
    "pass": "test1234",
    "email": "test@test.com",
    "jumlah": 0,
    "nomor_wallet": "bd21334d62a8d6512a0f5798d7c0cf08"
}
```

#### Response yang dapat diterima

| Status | Message |
| --- | --- |
| 200 | Data (sesuai contoh response) |
| 400 | Masukkan token |
| 400 | Token tidak valid |
| 500 | Server Error |

---

### Top Up

`PUT` https://api-ecia.herokuapp.com/api/profile/:id

Properties:

* Params: `id`
    > Top up untuk id berbeda hanya bisa dilakukan oleh admin
* Authorization: `BEARER <token>`
* Body (JSON):

| Object | Keterangan |
| --- | --- |
| jumlah | Jumlah saldo yang ingin ditambahkan kepada user dengan id yang dimasukkan ke dalam params |

> * User harus memasukkan nilai positif (lebih dari 0)
> * Admin dapat memasukkan nilai negatif

#### Response yang dapat diterima

| Status | Message | Keterangan Tambahan |
| :---: | --- | --- |
| 200 | Top Up berhasil | - |
| 400 | Masukkan token | Token tidak ada |
| 400 | Token tidak valid | Token salah |
| 400 | Saldo top up harus lebih dari 0 | Status ini hanya bisa didapatkan oleh user |
| 400 | User tidak ditemukan | - |
| 400 | Anda tidak dapat mengakses halaman ini | User ingin melakukan top up kepada user lain |
| 500 | Server Error | - |

---

### Pembelian

`POST` https://api-ecia.herokuapp.com/api/pembelian

Properties

* Params: -
* Authorization: `BEARER <token>`
* Body (JSON):

| Object | Keterangan |
| --- | --- |
| id_user | Id user yang ingin melakukan pembayaran |
| nama_barang | Nama barang/layanan yang ingin dibayar |
| harga | Harga dari barang/layanan yang ingin dibayar |
| nomor_wallet | Nomor wallet dari user |

> `nomor_wallet` dapat didapatkan [di sini](#cek-profil)

Contoh Response:

```json
{
    "status": 200,
    "id_pemesanan": 4,
    "message": "Pembelian berhasil, silahkan lanjutkan pembayaran dengan mengkonfirmasi pembayaran pada ewallet Anda"
}
```

#### Response yang dapat diterima

| Status | Message |
| --- | --- |
| 200 | Pembayaran berhasil |
| 400 | Masukkan token |
| 400 | Token tidak valid |
| 400 | Masukkan id_user |
| 400 | Harga harus lebih dari 0 |
| 400 | Masukkan nomor_wallet |
| 400 | Masukkan nama_barang dan harga |
| 400 | Nomor wallet salah |
| 400 | Saldo anda tidak mencukupi |
| 400 | Anda tidak dapat mengakses halaman ini |
| 500 | Server Error |

> Untuk status terakhir `Anda tidak dapat mengakses halaman ini`, berlaku ketika user melakukan pembayaran dengan id user lain
>
> Admin dapat melakukan pembayaran untuk user lain
---

### Cek Pembelian

`GET` https://api-ecia.herokuapp.com/api/pembelian/:id_user

Properties

* Params: `id_user`
  > Pengecekan untuk id_user berbeda hanya bisa dilakukan oleh admin
* Authorization: `BEARER <token>`

Contoh response:

```json
{
    "status": 200,
    "data":[
        "id_user":3,
        "id_pembelian":4,
        "nama_barang": "blablabla",
        "status": "PembayaranBerhasil"
    ]
}
```

Status: (pada data)

* MenungguPembayaran
* PembayaranBerhasil

#### Response yang dapat diterima

| Status | Message |
| --- | --- |
| 200 | Berhasil & memberikan data |
| 400 | Masukkan token |
| 400 | Token tidak valid |
| 400 | Anda tidak dapat mengakses halaman ini |

---

### Cek Pembelian Berdasarkan ID Pembelian

`GET` https://api-ecia.herokuapp.com/api/pembelian/:id_user/:id_pembelian

Properties

* Params: `id_user`, `id_pembelian`
  > Pengecekan untuk id_user berbeda hanya bisa dilakukan oleh admin
* Authorization: `BEARER <token>`

Contoh response:

```json
{
    "status": 200,
    "data":[
        {
            "id_user":3,
            "id_pembelian":4,
            "nama_barang": "blablabla",
            "harga": 400000,
            "wallet": "ecia",
            "nomor_wallet": "abcdefg",
            "status": "PembayaranBerhasil"
        }
    ]
}
```

Status: (pada data)

* MenungguPembayaran
* PembayaranBerhasil

#### Response yang dapat diterima

| Status | Message |
| --- | --- |
| 200 | Berhasil & memberikan data |
| 400 | Masukkan token |
| 400 | Token tidak valid |
| 400 | Anda tidak dapat mengakses halaman ini |

---

### Transaksi

`POST` https://api-ecia.herokuapp.com/api/transaksi

Properties

* Params: -
* Authorization: -
* Body (JSON):

| Object | Keterangan |
| --- | --- |
| jumlah | Harga dari barang |
| nomor_wallet_client | Nomor wallet client (didapatkan dari get profile) |
| nomor_wallet_ecommerce | Nomor wallet ecommerce |
<!-- | referensi | Referensi pembayaran (sesuai dengan [**respons id_pemesanan**](#pembelian)) | -->

#### Response yang dapat diterima

| Status | Message |
| --- | --- |
| 200 | Permintaan pembayaran berhasil |
| 400 | Nomor wallet atau nomor referensi tidak ditemukan |
| 400 | Pembayaran sudah selesai (status pembayaran = PembayaranSelesai) |
| 400 | Saldo anda tidak cukup |

---

### Transfer

`POST` https://api-ecia.herokuapp.com/api/transfer

Properties

* Params: -
* Authorization: `BEARER <token>`
* Body (JSON):

| Object | Keterangan |
| --- | --- |
| email | Email penerima |
| jumlah | Jumlah saldo yang ingin ditambahkan kepada user dengan email yang telah dimasukkan (Nilai yang dimasukkan harus positif) |

#### Response yang dapat diterima

| Status | Message |
| :---: | --- |
| 200 | Transfer berhasil |
| 400 | Masukkan token |
| 400 | Token tidak valid |
| 400 | Penerima tidak boleh kosong |
| 400 | Jumlah yang ditransfer harus lebih dari 0 |
| 400 | Penerima tidak ditemukan |
| 400 | Tidak dapat transfer ke diri sendiri |
| 400 | Saldo anda tidak mencukupi |
| 500 | Server Error |

---

### Riwayat / History

`GET` https://api-ecia.herokuapp.com/api/riwayat

Properties

* Params: -
* Authorization: `BEARER <token>`
* Body (JSON): -

#### Response yang dapat diterima

| Status | Message/Value | Keterangan |
| --- | --- | --- |
| 200 | History topup, bayar, transfer | Jika tidak ada transaksi pada salah satu layanan (topup, bayar, atau transfer), maka history akan bernilai `null` |
| 200 | User belum pernah melakukan transaksi | Jika user tidak pernah melakukan transaksi pada seluruh layanan (topup, bayar, dan transfer) |
| 400 | Masukkan token |
| 400 | Token tidak valid |
| 500 | Server Error |

#### Contoh response

Contoh 1

```json
{
    "status": 200,
    "topup": [
        {
            "id_history": 16,
            "nomor_wallet": "785e5eded22dff39052f072295f2ad44",
            "id_pengirim": 17,
            "id_penerima": 17,
            "waktu": "2022-06-04T10:54:27.000Z",
            "nominal": 100000
        },
        {
            "id_history": 18,
            "nomor_wallet": "20c7dd637bcdeef433589d1321f52363",
            "id_pengirim": 2,
            "id_penerima": 17,
            "waktu": "2022-06-04T14:41:56.000Z",
            "nominal": 100000
        },
        {
            "id_history": 19,
            "nomor_wallet": "785e5eded22dff39052f072295f2ad44",
            "id_pengirim": 17,
            "id_penerima": 17,
            "waktu": "2022-06-05T07:39:00.000Z",
            "nominal": 50000
        }
    ],
    "bayar": [
        {
            "id_history": 17,
            "nomor_wallet": "785e5eded22dff39052f072295f2ad44",
            "waktu": "2022-06-04T10:54:38.000Z",
            "nominal": 1000
        }
    ],
    "transfer": null
}
```

Contoh 2 (tidak pernah melakukan transaksi)

```json
{
    "status": 200,
    "message": "User belum pernah melakukan transaksi"
}
```

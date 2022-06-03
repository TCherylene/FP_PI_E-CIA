# API E-CIA

API ini untuk e-money dari kelompok 5 kelas A yang bernamakan E-CIA.

API E-CIA tersedia pada: `https://api-ecia.herokuapp.com/api`

## Kelompok 5

* Alda Risma Harjian 5027201004
* Sharira Saniane 5027201016
* Cherylene Trevina 50270201033

## Daftar Endpoints

Hal-hal yang bisa dilakukan dalam API E-CIA:

| Method | Endpoint | Dokumentasi | Deskripsi |
| :---: | --- | :---: | --- |
| POST | /profile | [register](#register) | Untuk melakukan registrasi akun |
| POST | /login | [login](#login) | Untuk masuk ke akun dan mendapatkan token |
| GET | /profile | [cek-profil](#cek-profil) |Untuk mendapatkan informasi akun (id, nama, email, pass, jumlah, nomor_wallet) |
| PUT | /profile/:id | [top up](#top-up) | Untuk melakukan top up |
| POST | /pembelian | [pembelian](#pembelian) | Untuk melakukan pembayaran terhadap suatu barang/layanan |
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

#### Contoh 1: (Email baru)

Body:

```json
{
    "name": "Test",
    "email":"test@test.com",
    "pass": "test1234"
}
```

Response:

![Response email baru](https://user-images.githubusercontent.com/77750276/171909287-5958ee20-88eb-4cd6-8c32-9f6b78825cb4.png)

#### Contoh 2: (Email sudah ada)

Body: 

```json
{
    "name": "Test",
    "email":"test@test.com",
    "pass": "test1234"
}
```

Response:

![Email sudah ada](https://user-images.githubusercontent.com/77750276/171909570-464cf5cf-7102-44d2-9863-e2f7f9d5b4b9.png)

---
### Login

`POST` https://api-ecia.herokuapp.com/api/login

Properties:

* Params: -
* Authorization: -
* Body (JSON):

| Object | Keterangan |
| --- | --- |
| email | Email yang digunakan untuk mendaftar (tidak boleh sama dengan user lain) |
| pass | Password akun (tidak ada ketentuan) |

#### Contoh 1: (Email ditemukan)

Body:

```json
{
    "email":"test@test.com",
    "pass": "test1234"
}
```

Response:

![email ditemukan](https://user-images.githubusercontent.com/77750276/171910053-38d9e219-8521-4512-8c24-82fd6297688d.png)

#### Contoh 2: (Email tidak ditemukan)

Body:

```json
{
    "email":"test1234@test.com",
    "pass": "test1234"
}
```

Response:

![Email tidak ditemukan](https://user-images.githubusercontent.com/77750276/171909880-bc87d882-033b-4a4a-86cd-c74e89543bac.png)

---

### Cek Profil

`GET` https://api-ecia.herokuapp.com/api/profile

Properties:

* Params: -
* Authorization: `BEARER <token>`
* Body (JSON): -

Contoh response:
![Cek profile](https://user-images.githubusercontent.com/77750276/171910592-094993e1-b377-452c-8906-d211ce9924c0.png)

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
| 400 | Saldo top up harus lebih dari 0 | Status ini hanya bisa didapatkan oleh user |
| 400 | User tidak ditemukan | - |
| 400 | Anda tidak dapat mengakses halaman ini | User ingin melakukan top up kepada user lain |
| 500 | Server Error | - |

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
| 400 | Penerima tidak boleh kosong |
| 400 | Jumlah yang ditransfer harus lebih dari 0 |
| 400 | Penerima tidak ditemukan |
| 400 | Tidak dapat transfer ke diri sendiri |
| 400 | Saldo anda tidak mencukupi |
| 500 | Server Error |

---

### Pembelian

`POST` https://api-ecia.herokuapp.com/api/pembelian

Properties

* Params: -
* Authorization: `BEARER <token>`
* Body (JSON):

| Object | Keterangan |
| --- | --- |
| id_user | Id user yang ingin melakukan pembayaran (opsional)|
| nama_barang | Nama barang/layanan yang ingin dibayar |
| harga | Harga dari barang/layanan yang ingin dibayar | 
| nomor_wallet | Nomor wallet dari user |

> `nomor_wallet` dapat didapatkan [di sini](#cek-profil)

---

### Riwayat / History

`GET` https://api-ecia.herokuapp.com/api/riwayat

Properties

* Params: -
* Authorization: `BEARER <token>`
* Body (JSON): -

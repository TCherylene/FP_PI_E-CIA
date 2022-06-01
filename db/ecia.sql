-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 01 Jun 2022 pada 17.08
-- Versi server: 10.4.21-MariaDB
-- Versi PHP: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecia`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bayar`
--

CREATE TABLE `bayar` (
  `id_bayar` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `nomor_pelanggan` int(11) NOT NULL,
  `layanan` int(11) NOT NULL,
  `jumlah_pembayaran` bigint(20) NOT NULL,
  `tanggal` date NOT NULL DEFAULT current_timestamp(),
  `waktu` time NOT NULL DEFAULT current_timestamp(),
  `berita_acara` varchar(200) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `daftar_client`
--

CREATE TABLE `daftar_client` (
  `id_client` int(11) NOT NULL,
  `nama_client` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` text NOT NULL,
  `nomor_wallet` text NOT NULL,
  `saldo` int(11) NOT NULL,
  `role` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `daftar_client`
--

INSERT INTO `daftar_client` (`id_client`, `nama_client`, `email`, `password`, `nomor_wallet`, `saldo`, `role`) VALUES
(1, 'Manura', 'manura@manura.com', '81dc9bdb52d04dc20036dbd8313ed055', '54ac17782fe813a6fe21a0d5133cc744', 10000, 1),
(2, 'Alda', 'alda@alda.com', '81dc9bdb52d04dc20036dbd8313ed055', '20c7dd637bcdeef433589d1321f52363', 0, 1),
(3, 'Ira', 'ira@ira.com', '81dc9bdb52d04dc20036dbd8313ed055', '87823d8de907cd4a582dee291d146f92', 60000, 1),
(23, 'orang', 'orang@orang.com', '81dc9bdb52d04dc20036dbd8313ed055', 'f32ca741291b8d0ef14f6b6ed7538d3b', 0, 0),
(24, 'halo', 'halo@halo.com', '81dc9bdb52d04dc20036dbd8313ed055', '7a98ddf3ac08ccbb32e3668cde6cd59e', 0, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `daftar_client_layanan`
--

CREATE TABLE `daftar_client_layanan` (
  `id_daftar` smallint(6) NOT NULL,
  `id_client` smallint(6) NOT NULL,
  `layanan` varchar(5) NOT NULL,
  `nomor_pelanggan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `topup`
--

CREATE TABLE `topup` (
  `id_topUp` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `jumlah_topUp` bigint(20) NOT NULL,
  `tanggal` date NOT NULL DEFAULT current_timestamp(),
  `waktu` time NOT NULL DEFAULT current_timestamp(),
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `topup`
--

INSERT INTO `topup` (`id_topUp`, `id_client`, `jumlah_topUp`, `tanggal`, `waktu`, `status`) VALUES
(11, 3, 5000, '2022-06-01', '21:40:58', 1),
(12, 3, 5000, '2022-06-01', '21:40:58', 1),
(13, 3, 5000, '2022-06-01', '21:40:58', 1),
(14, 3, 5000, '2022-06-01', '21:40:58', 1),
(15, 3, 5000, '2022-06-01', '21:40:58', 1),
(16, 3, 5000, '2022-06-01', '21:40:58', 1),
(17, 1, 5000, '2022-06-01', '21:40:58', 1),
(18, 1, 5000, '2022-06-01', '21:40:58', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `transfer`
--

CREATE TABLE `transfer` (
  `id_transfer` int(11) NOT NULL,
  `id_pengirim` int(11) NOT NULL,
  `id_penerima` int(11) NOT NULL,
  `tanggal` date NOT NULL DEFAULT current_timestamp(),
  `jam` time NOT NULL DEFAULT current_timestamp(),
  `nominal` bigint(20) NOT NULL,
  `berita_acara` varchar(200) NOT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bayar`
--
ALTER TABLE `bayar`
  ADD PRIMARY KEY (`id_bayar`),
  ADD KEY `id_client` (`id_client`);

--
-- Indeks untuk tabel `daftar_client`
--
ALTER TABLE `daftar_client`
  ADD PRIMARY KEY (`id_client`);

--
-- Indeks untuk tabel `daftar_client_layanan`
--
ALTER TABLE `daftar_client_layanan`
  ADD PRIMARY KEY (`id_daftar`);

--
-- Indeks untuk tabel `topup`
--
ALTER TABLE `topup`
  ADD PRIMARY KEY (`id_topUp`),
  ADD KEY `id_client` (`id_client`);

--
-- Indeks untuk tabel `transfer`
--
ALTER TABLE `transfer`
  ADD PRIMARY KEY (`id_transfer`),
  ADD UNIQUE KEY `id_transaksi` (`id_transfer`),
  ADD KEY `id_pengirim` (`id_pengirim`),
  ADD KEY `id_penerima` (`id_penerima`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bayar`
--
ALTER TABLE `bayar`
  MODIFY `id_bayar` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `daftar_client`
--
ALTER TABLE `daftar_client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `daftar_client_layanan`
--
ALTER TABLE `daftar_client_layanan`
  MODIFY `id_daftar` smallint(6) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `topup`
--
ALTER TABLE `topup`
  MODIFY `id_topUp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `transfer`
--
ALTER TABLE `transfer`
  MODIFY `id_transfer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bayar`
--
ALTER TABLE `bayar`
  ADD CONSTRAINT `bayar_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `daftar_client` (`id_client`);

--
-- Ketidakleluasaan untuk tabel `topup`
--
ALTER TABLE `topup`
  ADD CONSTRAINT `topup_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `daftar_client` (`id_client`);

--
-- Ketidakleluasaan untuk tabel `transfer`
--
ALTER TABLE `transfer`
  ADD CONSTRAINT `transfer_ibfk_1` FOREIGN KEY (`id_pengirim`) REFERENCES `daftar_client` (`id_client`),
  ADD CONSTRAINT `transfer_ibfk_2` FOREIGN KEY (`id_penerima`) REFERENCES `daftar_client` (`id_client`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

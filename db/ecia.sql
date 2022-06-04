-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: sql6.freesqldatabase.com
-- Generation Time: 04 Jun 2022 pada 11.01
-- Versi Server: 5.5.62-0ubuntu0.14.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sql6497442`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `daftar_client`
--

CREATE TABLE `daftar_client` (
  `id_client` int(11) NOT NULL,
  `nama_client` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `nomor_wallet` varchar(32) NOT NULL,
  `saldo` bigint(20) NOT NULL,
  `role` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `daftar_client`
--

INSERT INTO `daftar_client` (`id_client`, `nama_client`, `email`, `password`, `nomor_wallet`, `saldo`, `role`) VALUES
(1, 'Manura', 'manura@manura.com', '1234', '54ac17782fe813a6fe21a0d5133cc744', 6600, 1),
(2, 'Alda', 'alda@alda.com', '1234', '20c7dd637bcdeef433589d1321f52363', 33001, 1),
(3, 'Ira', 'ira@ira.com', '1234', '87823d8de907cd4a582dee291d146f92', 20500, 1),
(4, 'halo', 'halo@halo.com', '1234', '142a52c5e20510265959a4731f6f37d8', 0, 0),
(5, 'chery', 'chery@chery.com', '1234', '331ec7b9b34247bd4f96a6d3f0237982', 0, 1),
(7, 'apip', 'apip@apip.com', '1234', 'bdd0a4cffae046b826e407b03cc025b1', 0, 0),
(9, 'boy', 'boy@boy.com', '1234', '71e8dd6dd581f0d97a6e932e20688f0a', 0, 0),
(11, 'ara', 'ara@ara.ara', 'ara', 'fd7a96cba8ecd3b9861d5f92bee6687d', 0, 0),
(12, 'haffif', 'haffif@haffif.com', '1234', '1a87502969f415a06a1d66837ed65fdf', 0, 0),
(13, 'haffif', 'haf@haffif.com', '1234', '7bb5fe01ae4841eba6abfa783266a7de', 0, 0),
(14, 'Test', 'test@test.com', 'test1234', '9202c79a52367272993065f5488a6eb5', 199900, 0),
(15, 'halo', 'haihai@hai.com', '1234', 'd325a1d82527a67072e1fa360eba2bff', 0, 0),
(16, 'meri', 'kutehe@gmail.com', '1234', '17a9a5eca11d4952dd3fcf5841588740', 0, 0),
(17, 'test', 'test@gmail.com', '1234', '785e5eded22dff39052f072295f2ad44', 99000, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `history`
--

CREATE TABLE `history` (
  `id_history` int(11) NOT NULL,
  `jenis_transaksi` varchar(10) NOT NULL,
  `nomor_wallet` varchar(32) NOT NULL,
  `id_pengirim` int(11) NOT NULL,
  `id_penerima` int(11) NOT NULL,
  `waktu` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nominal` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `history`
--

INSERT INTO `history` (`id_history`, `jenis_transaksi`, `nomor_wallet`, `id_pengirim`, `id_penerima`, `waktu`, `nominal`) VALUES
(1, 'topup', '20c7dd637bcdeef433589d1321f52363', 2, 2, '0000-00-00 00:00:00', 1),
(2, 'topup', '20c7dd637bcdeef433589d1321f52363', 2, 2, '0000-00-00 00:00:00', 15000),
(3, 'bayar', '20c7dd637bcdeef433589d1321f52363', 2, 0, '0000-00-00 00:00:00', 15000),
(4, 'top up', '20c7dd637bcdeef433589d1321f52363', 2, 2, '0000-00-00 00:00:00', 30000),
(5, 'top up', '87823d8de907cd4a582dee291d146f92', 3, 2, '0000-00-00 00:00:00', 30000),
(6, 'top up', '87823d8de907cd4a582dee291d146f92', 3, 3, '0000-00-00 00:00:00', 30000),
(7, 'bayar', '87823d8de907cd4a582dee291d146f92', 3, 0, '0000-00-00 00:00:00', 15000),
(8, 'topup', '87823d8de907cd4a582dee291d146f92', 3, 3, '0000-00-00 00:00:00', 30000),
(9, 'transfer', '87823d8de907cd4a582dee291d146f92', 3, 1, '0000-00-00 00:00:00', 15000),
(10, 'bayar', '54ac17782fe813a6fe21a0d5133cc744', 1, 0, '0000-00-00 00:00:00', 15000),
(11, 'transfer', '54ac17782fe813a6fe21a0d5133cc744', 1, 2, '0000-00-00 00:00:00', 3000),
(12, 'transfer', '54ac17782fe813a6fe21a0d5133cc744', 1, 3, '0000-00-00 00:00:00', 5500),
(13, 'topup', '9202c79a52367272993065f5488a6eb5', 14, 14, '0000-00-00 00:00:00', 100000),
(14, 'topup', '9202c79a52367272993065f5488a6eb5', 14, 14, '0000-00-00 00:00:00', 100000),
(15, 'transfer', '9202c79a52367272993065f5488a6eb5', 14, 1, '0000-00-00 00:00:00', 100),
(16, 'topup', '785e5eded22dff39052f072295f2ad44', 17, 17, '2022-06-04 10:54:27', 100000),
(17, 'bayar', '785e5eded22dff39052f072295f2ad44', 17, 0, '2022-06-04 10:54:38', 1000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daftar_client`
--
ALTER TABLE `daftar_client`
  ADD PRIMARY KEY (`id_client`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id_history`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `daftar_client`
--
ALTER TABLE `daftar_client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id_history` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

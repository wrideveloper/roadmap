# 📋 Proyek Absensi: PHP & Database

<div align="center">

![Logo WRI](/miniclass/backend/assets/proyek-absensi/logo-wri.jpg)

**Praktik langsung: dari database sampai aplikasi absensi mahasiswa yang utuh.**

</div>

## 🎯 Apa yang Akan Dibangun?

Sebuah aplikasi **absensi mahasiswa** dengan fitur:

- ➕ **Create** — tambah data absensi (nama, NIM, status, tanggal)
- 📖 **Read** — tampilkan seluruh data dalam tabel HTML
- ✏️ **Update** — edit data lewat form yang terisi otomatis (*pre-filled*)
- 🗑️ **Delete** — hapus data dengan konfirmasi JavaScript

### Struktur Data

Database `db_absensi`, tabel `tb_absensi`:

```sql
CREATE DATABASE db_absensi;
USE db_absensi;

CREATE TABLE tb_absensi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nim VARCHAR(20) NOT NULL,
    status ENUM('Hadir', 'Izin', 'Sakit', 'Alpa') NOT NULL,
    tanggal DATE NOT NULL
);
```

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | Identitas unik tiap baris, terisi otomatis |
| `nama` | `VARCHAR(100) NOT NULL` | Nama mahasiswa, wajib diisi |
| `nim` | `VARCHAR(20) NOT NULL` | Nomor induk mahasiswa, wajib diisi |
| `status` | `ENUM('Hadir','Izin','Sakit','Alpa')` | Hanya boleh salah satu dari empat nilai |
| `tanggal` | `DATE NOT NULL` | Format `YYYY-MM-DD` |

:::tip 💡 Kenapa contoh ini?
Satu tabel, lima kolom, empat tipe data (`INT`, `VARCHAR`, `ENUM`, `DATE`) plus `PRIMARY KEY` dan `NOT NULL` — cukup untuk melatih semua konsep fundamental tanpa kompleksitas yang tidak perlu.
:::

## 🗺️ Alur Belajar (4 Pertemuan)

| Pertemuan | Tema | Materi |
|-----------|------|--------|
| [Pertemuan 1](./pertemuan-1-database-ddl) | Pengenalan Database, Setup, & DDL | Apa itu database, tabel/baris/kolom, tipe data SQL, setup Laragon + phpMyAdmin, `CREATE`/`ALTER`/`DROP TABLE` |
| [Pertemuan 2](./pertemuan-2-php-dml-koneksi) | Pengenalan PHP, DML, & Koneksi | Sintaks dasar PHP, `INSERT`/`SELECT`/`UPDATE`/`DELETE`, `koneksi.php` dengan `mysqli_connect()` |
| [Pertemuan 3](./pertemuan-3-crud-read-create) | CRUD 1: Read & Create | Form HTML, `SELECT` + `while` loop ke tabel, validasi `required` |
| [Pertemuan 4](./pertemuan-4-crud-update-delete) | CRUD 2: Update & Delete | `UPDATE ... WHERE id`, `$_GET['id']`, `edit.php` pre-filled, `hapus.php` + `confirm()` |

Halaman pelengkap:

- [Instalasi (macOS)](./instalasi) — setup Homebrew/XAMPP untuk pengguna MacBook.
- [Kode Lengkap & PDO API](./kode-absensi) — bedah kode sumber asli (`schema.sql`, `koneksi.php`, `api/absensi.php`) plus perbandingan mysqli vs PDO.

## 🔗 Prasyarat

Sebelum mulai, pastikan sudah memahami materi fundamental:

- [Database](/miniclass/backend/fundamental/database) dan [MySQL](/miniclass/backend/fundamental/mysql) — konsep tabel, primary key, tipe data, sintaks SQL.
- [PHP](/miniclass/backend/fundamental/php) — variabel, kondisi, perulangan, fungsi, `include`.
- [HTML](/miniclass/backend/fundamental/html) — struktur dasar dan form.
- [Server Side](/miniclass/backend/fundamental/server-side) — alur request/response client-server.

## 🖥️ Kebutuhan Perangkat Lunak

| Sistem | Pilihan |
|--------|---------|
| Windows | Laragon (disarankan di materi) |
| macOS | Homebrew + MySQL atau XAMPP — lihat [Instalasi](./instalasi) |

Semua pertemuan memakai database yang sama (`db_absensi`), jadi setup cukup dilakukan sekali di awal.

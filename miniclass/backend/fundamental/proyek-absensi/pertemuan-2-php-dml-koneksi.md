# 🐘 Pertemuan 2: Pengenalan PHP + Praktek DML + Koneksi PHP

**Tema:** Pengenalan PHP, Praktek DML, dan Pembuatan Koneksi Database

<div align="center">

![PHP](/miniclass/backend/assets/php.png)

</div>

## 1. Pengenalan PHP

### Apa itu PHP?

**PHP** (*Hypertext Preprocessor*) adalah bahasa pemrograman **server-side** yang dieksekusi di server sebelum hasilnya dikirim ke browser.

<div align="center">

![Server Side Programming](/miniclass/backend/assets/ssp.png)

*Kode PHP berjalan di server, browser hanya menerima hasilnya (HTML).*

</div>

### Sintaks Dasar & Variabel

File PHP diawali tag pembuka `<?php` dan diakhiri `?>`. Variabel dideklarasikan dengan tanda dolar (`$nama_variabel`):

```php
<?php
// String
$nama = "Andi";

// Integer
$umur = 21;

// Boolean
$hadir = true;

// Array
$status_list = ["Hadir", "Izin", "Sakit", "Alpa"];

echo "Nama: $nama, Umur: $umur";
?>
```

Tipe data dasar: **string**, **integer**, **boolean**, **array**. Referensi sintaks lengkap (kondisi, perulangan, fungsi, `include`/`require`) ada di [Pengenalan PHP](/miniclass/backend/fundamental/php).

### Server Lokal Laragon

Laragon menjalankan file PHP melalui folder **root** (misalnya `D:\laragon\www\`). File yang diletakkan di folder root bisa diakses lewat browser, contohnya `http://localhost/wri-backend-2026/index.php`.

Pengguna macOS: folder root-nya berbeda (lihat [Instalasi](./instalasi)).

## 2. Praktek DML (Data Manipulation Language)

**DML** adalah perintah SQL untuk memanipulasi data di dalam tabel yang sudah dibuat. (Di bawah ini memakai tabel `tb_absensi` dari [Pertemuan 1](./pertemuan-1-database-ddl).)

<div align="center">

![Perbandingan sintaks SQL dan NoSQL](/miniclass/backend/assets/sintaksSql.png)

*Pola `INSERT`, `UPDATE`, `SELECT` yang dipakai di bawah — sisi SQL-nya.*

</div>

### `INSERT` — memasukkan data baru

```sql
INSERT INTO tb_absensi (nama, nim, status, tanggal)
VALUES ('Andi', '12345', 'Hadir', '2026-10-19');
```

### `SELECT` — membaca data (dengan `WHERE` untuk filter)

```sql
-- Semua data
SELECT * FROM tb_absensi;

-- Hanya yang hadir
SELECT * FROM tb_absensi WHERE status = 'Hadir';
```

### `UPDATE` — mengubah data yang sudah ada

```sql
UPDATE tb_absensi
SET status = 'Sakit'
WHERE id = 1;
```

:::warning ⚠️ Jangan lupa `WHERE`!
Tanpa `WHERE`, `UPDATE` mengubah **seluruh baris** di tabel. Selalu batasi dengan kondisi (misalnya berdasarkan `id`).
:::

### `DELETE` — menghapus data tertentu

```sql
DELETE FROM tb_absensi WHERE id = 1;
```

Aturan yang sama berlaku: tanpa `WHERE`, seluruh isi tabel terhapus.

## 3. Membuat Koneksi Database

PHP terhubung ke MySQL memakai fungsi bawaan `mysqli_connect()` atau objek `new mysqli()`.

Buat satu file khusus koneksi (`koneksi.php`) agar bisa dipakai ulang di file lain via `include` atau `require`:

```php
<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_absensi";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}
?>
```

Penjelasan tiap bagian:

| Baris | Fungsi |
|-------|--------|
| `$host`, `$user`, `$pass`, `$db` | Kredensial server — sesuaikan dengan setup Laragon/XAMPP/Homebrew |
| `mysqli_connect(...)` | Membuka koneksi ke MySQL, hasilnya disimpan di `$koneksi` |
| `if (!$koneksi)` | Pengecekan error — program berhenti dengan pesan jika koneksi gagal |
| `include 'koneksi.php';` | Memakai koneksi ini di file lain tanpa menulis ulang kredensial |

:::tip 💡 mysqli vs PDO
Materi ini memakai **mysqli** karena paling dekat dengan pemula. Kode sumber proyek juga memiliki versi modern berbasis **PDO + prepared statements** (`koneksi.php` dan `api/absensi.php` di proyek asli). Perbandingannya dibahas tuntas di [Kode Lengkap & PDO API](./kode-absensi).
:::

## ✅ Checklist Pertemuan 2

- [ ] Bisa menulis tag PHP, variabel, dan tipe data dasar
- [ ] Bisa menjalankan `INSERT`, `SELECT` (+`WHERE`), `UPDATE`, `DELETE` di `tb_absensi`
- [ ] File `koneksi.php` terbuat dan koneksi ke `db_absensi` berhasil
- [ ] Paham kenapa `WHERE` wajib di `UPDATE`/`DELETE`

## ➡️ Lanjut

[Pertemuan 3: CRUD 1 — Read & Create](./pertemuan-3-crud-read-create) — menampilkan data ke tabel HTML dan menambah data lewat form.

# 💾 Pertemuan 1: Pengenalan Database, Setup, & Praktek DDL

**Tema:** Pengenalan Database, Setup Database, dan Praktek DDL (Data Definition Language)

<div align="center">

![Database](/miniclass/backend/assets/db.png)

</div>

## 1. Pengenalan Database & Relasi

### Apa itu Database?

**Database** adalah tempat penyimpanan data yang terstruktur secara elektronik di dalam komputer atau server. Di web development, database bertindak sebagai pusat penyimpanan data aplikasi (seperti data user, produk, atau absensi).

:::info 💡 Sudah dibahas di fundamental
Konsep dasar database, database relasional vs NoSQL, dan perbandingan sintaksnya ada di [Pengenalan Database](/miniclass/backend/fundamental/database). Di sini kita langsung praktik dengan studi kasus absensi.
:::

### Konsep Tabel, Baris, & Kolom

Data disimpan dalam bentuk **tabel** (relasi):

- **Kolom** (*field/atribut*) mendefinisikan jenis data — misalnya `nama`, `nim`, `tanggal`.
- **Baris** (*record/tuple*) berisi data aktual per individu — misalnya satu baris untuk satu mahasiswa.

Contoh tabel `tb_absensi`:

| id | nama | nim | status | tanggal |
|----|------|-----|--------|---------|
| 1 | Andi | 12345 | Hadir | 2026-10-19 |
| 2 | Budi | 12346 | Izin | 2026-10-19 |

<div align="center">

![SQL Database](/miniclass/backend/assets/sql.png)

*Contoh relasi antar-tabel pada database SQL.*

</div>

### Tipe Data SQL

Jenis-jenis data dasar yang dipakai di proyek ini:

| Tipe | Keterangan | Contoh di `tb_absensi` |
|------|------------|------------------------|
| `INT` | Angka bulat | `id INT AUTO_INCREMENT PRIMARY KEY` |
| `VARCHAR(n)` | Teks dengan panjang tertentu | `nama VARCHAR(100)`, `nim VARCHAR(20)` |
| `TEXT` | Teks panjang | Alternatif jika butuh catatan bebas |
| `DATE` | Tanggal (`YYYY-MM-DD`) | `tanggal DATE NOT NULL` |

Daftar lengkap tipe data MySQL (termasuk `ENUM`, numerik, dan tanggal/waktu) ada di [Pengenalan MySQL](/miniclass/backend/fundamental/mysql).

:::tip 💡 Primary Key
Kolom `id` memakai `INT AUTO_INCREMENT PRIMARY KEY` — nilainya unik dan terisi otomatis (1, 2, 3, ...) setiap ada baris baru. Detail konsepnya:

![Primary Key](/miniclass/backend/assets/pk.png)

:::

## 2. Setup Database di Laragon (phpMyAdmin)

Langkah ini untuk pengguna **Windows**. Pengguna macOS lihat [Instalasi (macOS)](./instalasi).

1. **Nyalakan layanan MySQL/MariaDB** melalui control panel Laragon (klik tombol Start).
2. **Buka phpMyAdmin** di browser: `http://localhost/phpmyadmin/`
3. **Buat database baru** bernama `db_absensi` (klik *New* → isi nama → *Create*).

:::info 📝 Hasil akhir
Setelah langkah ini, server database berjalan dan database kosong `db_absensi` siap dipakai. Isi tabelnya dibuat di bagian DDL di bawah.
:::

## 3. Praktek DDL (Data Definition Language)

**DDL** adalah perintah SQL yang digunakan untuk mendefinisikan struktur database atau tabel.

### `CREATE TABLE`

Membuat tabel baru beserta kolom dan tipe datanya:

```sql
USE db_absensi;

CREATE TABLE tb_absensi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nim VARCHAR(20) NOT NULL,
    status ENUM('Hadir', 'Izin', 'Sakit', 'Alpa') NOT NULL,
    tanggal DATE NOT NULL
);
```

### `ALTER TABLE`

Memodifikasi struktur tabel yang sudah ada — misalnya menambah kolom baru atau mengubah tipe data:

```sql
-- Menambah kolom keterangan
ALTER TABLE tb_absensi
ADD keterangan TEXT;

-- Mengubah panjang kolom nama
ALTER TABLE tb_absensi
MODIFY nama VARCHAR(150) NOT NULL;
```

### `DROP TABLE`

Menghapus tabel secara permanen dari database:

```sql
DROP TABLE tb_absensi;
```

:::warning ⚠️ Hati-hati!
`DROP TABLE` menghapus tabel **beserta seluruh datanya** secara permanen dan tidak bisa di-undo. Pastikan nama tabel sudah benar sebelum menjalankannya.
:::

## ✅ Checklist Pertemuan 1

- [ ] Bisa menjelaskan apa itu database, tabel, baris, dan kolom
- [ ] Laragon berjalan dan database `db_absensi` terbuat
- [ ] Tabel `tb_absensi` terbuat via `CREATE TABLE`
- [ ] Pernah mencoba `ALTER TABLE` dan memahami bahaya `DROP TABLE`

## ➡️ Lanjut

[Pertemuan 2: Pengenalan PHP, DML, & Koneksi](./pertemuan-2-php-dml-koneksi) — mengisi dan membaca data lewat `INSERT`/`SELECT`/`UPDATE`/`DELETE` serta menghubungkan PHP ke MySQL.

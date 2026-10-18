# 🧪 Studi Kasus: Mini Proyek Absensi

Capstone fundamental: bangun **aplikasi absensi mahasiswa yang utuh dan bisa dijalankan** (`db_absensi` / `tb_absensi`) hanya dari materi di bagian ini. Tidak ada file untuk diunduh. Kamu menyusunnya sendiri, dan setiap langkahnya sudah dibahas di halaman fundamental yang ditautkan di bawah.

## Yang Akan Kamu Bangun

- ➕ **Create**: form tambah data (nama, NIM, status, tanggal)
- 📖 **Read**: tabel HTML berisi seluruh data dari database
- ✏️ **Update**: form edit yang terisi otomatis (*pre-filled*)
- 🗑️ **Delete**: hapus data dengan konfirmasi JavaScript
- 🚀 **Lanjutan**: versi API JSON modern (PDO + prepared statements)

## Peta Proyek

Struktur file yang kamu buat mengikuti proyek aslinya:

```text
wri-backend-2026/
├── schema.sql      # struktur database + tabel
├── koneksi.php     # koneksi PHP ke MySQL (mysqli)
├── index.php       # halaman utama: form + tabel daftar
├── edit.php        # form edit pre-filled
├── hapus.php       # hapus data via ?id=...
├── style.css       # tampilan
└── api/
    └── absensi.php # REST API JSON (PDO, lanjutan)
```

| File | Dibahas di |
|------|------------|
| `schema.sql` (`CREATE DATABASE`, `CREATE TABLE tb_absensi`) | [Database](/miniclass/backend/fundamental/database), [MySQL](/miniclass/backend/fundamental/mysql) |
| `koneksi.php` (`mysqli_connect`, cek error, `include`) | [PHP](/miniclass/backend/fundamental/php) |
| `index.php` (form `POST`, `INSERT`, `SELECT` + `while` ke tabel) | [HTML](/miniclass/backend/fundamental/html), [PHP](/miniclass/backend/fundamental/php), [Server Side](/miniclass/backend/fundamental/server-side) |
| `edit.php` (`$_GET['id']`, `value="..."`, `UPDATE`) | [PHP](/miniclass/backend/fundamental/php), [HTML](/miniclass/backend/fundamental/html) |
| `hapus.php` (`DELETE`, `confirm()`, redirect) | [PHP](/miniclass/backend/fundamental/php), [HTML](/miniclass/backend/fundamental/html) |
| `api/absensi.php` (PDO, validasi, status code) | [PHP](/miniclass/backend/fundamental/php) |

## Cara Mengerjakan

1. **Siapkan lingkungan** mengikuti [Instalasi & Setup](/miniclass/backend/fundamental/instalasi) (Windows, macOS, atau Linux).
2. **Buat database dan tabel** persis seperti di [Database](/miniclass/backend/fundamental/database):

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

3. **Tulis `koneksi.php`**, lalu **form + tabel `index.php`** ([PHP](/miniclass/backend/fundamental/php), [HTML](/miniclass/backend/fundamental/html)).
4. **Tambah `edit.php` dan `hapus.php`** untuk Update dan Delete.
5. **Jalankan**: letakkan folder proyek di document root (misalnya `D:\laragon\www\` di Laragon, `/Applications/XAMPP/htdocs/` di XAMPP) lalu buka `http://localhost/wri-backend-2026/`. Alternatif tanpa web server: `php -S localhost:8000` dari dalam folder proyek.
6. **Lanjutan**: tulis ulang akses datanya memakai PDO + prepared statements, atau bangun `api/absensi.php` sebagai REST API JSON.

### Referensi endpoint (versi API)

| Method | URL | Hasil |
|--------|-----|-------|
| `GET` | `/api/absensi.php` | Daftar + statistik, atau filter `?status=Hadir` |
| `GET` | `/api/absensi.php?id=1` | Satu data (`404` jika tidak ada) |
| `POST` | `/api/absensi.php` | Tambah data (`201`, gagal validasi `422`) |
| `PUT` / `PATCH` | `/api/absensi.php?id=1` | Update penuh / parsial |
| `DELETE` | `/api/absensi.php?id=1` | Hapus data |

Detail validasi, status code, dan perbandingan mysqli vs PDO ada di [PHP](/miniclass/backend/fundamental/php).

:::info 📝 Catatan
Versi HTML (mysqli) cocok untuk belajar alur CRUD pertama kali. Untuk proyek nyata, pakai pola PDO. Atribut `required` di form membantu UX, tapi validasi sesungguhnya selalu di server.
:::

## ✅ Checklist Selesai

- [ ] `db_absensi` + `tb_absensi` terbuat, server database berjalan
- [ ] `koneksi.php` terhubung tanpa error
- [ ] Form tambah menyimpan data dan redirect ke daftar
- [ ] Tabel menampilkan semua data via `SELECT` + loop
- [ ] Form edit terisi data lama dan update bekerja (`UPDATE ... WHERE id`)
- [ ] Hapus meminta konfirmasi dan redirect setelah `DELETE`
- [ ] (Lanjutan) endpoint API merespons JSON dengan status code yang tepat

## Tantangan Berikutnya

- Tambah filter/pencarian (misalnya cari nama) dan pagination di tabel
- Tulis ulang query mysqli menjadi PDO prepared statements
- Tambah autentikasi sederhana sebelum masuk studi kasus [Laravel](/miniclass/backend/laravel/apa-itu-laravel)
- Rapikan kode prosedural ke pola [MVC](/miniclass/backend/mvc/apa-itu-mvc)

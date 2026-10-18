# 💻 Kode Lengkap & PDO API

Bedah kode sumber asli proyek absensi: `schema.sql`, `koneksi.php` (PDO), dan `api/absensi.php` (REST API JSON). Anggap halaman ini sebagai **langkah lanjutan** setelah CRUD mysqli di [Pertemuan 2](./pertemuan-2-php-dml-koneksi)–[Pertemuan 4](./pertemuan-4-crud-update-delete).

<div align="center">

<img src="/miniclass/backend/assets/rest-api-illustration.webp" style="border-radius: 10px;" alt="ilustrasi-rest-api" width=600></img>

*Pola yang dipakai API: HTTP method (GET/POST/PUT/DELETE) ↔ JSON.*

</div>

## 1. `schema.sql` — Struktur Database

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

Sama persis dengan yang dibuat manual di [Pertemuan 1](./pertemuan-1-database-ddl) — file ini versi yang bisa dijalankan sekaligus (`mysql -u root < schema.sql`).

## 2. `koneksi.php` — Koneksi PDO

```php
<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "db_absensi";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    error_log("[Database Connection Error] " . $e->getMessage());

    http_response_code(500);
    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode([
        "status" => "error",
        "message" => "Koneksi database gagal.",
        "details" => "Periksa konfigurasi database atau hubungi administrator."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}
```

| Opsi | Fungsi |
|------|--------|
| `ERRMODE_EXCEPTION` | Error database dilempar sebagai exception (bisa di-`catch`) |
| `FETCH_ASSOC` | Hasil query berupa array asosiatif (`$row['nama']`) |
| `EMULATE_PREPARES => false` | Prepared statement asli di sisi MySQL (lebih aman) |

## 3. `api/absensi.php` — REST API JSON

Satu file melayani lima operasi via HTTP method + query string. Semua respons berformat JSON (`{"status": ..., "data"/"message"/"errors": ...}`).

### READ — daftar + satu data + filter

```http
GET /api/absensi.php
GET /api/absensi.php?id=1
GET /api/absensi.php?status=Hadir
```

- Semua memakai **prepared statements** (`:id`, `:status`) — anti SQL injection.
- Respons daftar menyertakan `statistics` (jumlah Hadir/Izin/Sakit/Alpa), `total_data`, dan `data` terurut `id DESC`.
- ID tidak valid → `400`; data tidak ada → `404`; filter status salah → `422`.

### CREATE

```http
POST /api/absensi.php
Content-Type: application/json

{"nama": "Andi", "nim": "12345", "status": "Hadir", "tanggal": "2026-10-19"}
```

<div align="center">

<img src="/miniclass/backend/assets/postman_header.webp" style="border-radius: 10px;" alt="postman-headers" width=600></img>

*Uji endpoint ini di Postman dengan header `Content-Type: application/json` — fungsi `getInput()` di API mendeteksi header itu untuk membaca body JSON (selain itu dibaca sebagai `$_POST` biasa).*

</div>

Validasi server (`validateAbsensi()`): semua field wajib, `nama` maks 255, `nim` maks 50, `status` harus salah satu dari empat nilai, `tanggal` harus valid `YYYY-MM-DD`. Gagal → `422` berisi rincian per field. Sukses → `201` + data termasuk `id` baru (`lastInsertId()`).

### UPDATE — PUT (penuh) vs PATCH (parsial)

```http
PUT   /api/absensi.php?id=1
PATCH /api/absensi.php?id=1
```

- `PUT` wajib mengirim **seluruh field**; `PATCH` boleh sebagian (field tak dikirim diambil dari data saat ini) tapi body tidak boleh kosong dan field tak dikenal ditolak (`400`).
- ID wajib (`400` jika absen/tidak valid), data tidak ada → `404`. Sukses → `200`.

### DELETE

```http
DELETE /api/absensi.php?id=1
```

ID wajib dan valid (`400`), baris tidak ada → `404` (dicek via `rowCount()`), sukses → `200` + `id`.

### Error handling

- Method selain GET/POST/PUT/PATCH/DELETE → `405` + header `Allow`.
- Detail error database hanya masuk server log (`error_log`); klien menerima pesan umum (`500`), atau `409` untuk pelanggaran constraint (SQLSTATE `23`).

## 4. mysqli vs PDO — Perbandingan Jujur

| Aspek | Materi Pertemuan 2–4 (mysqli) | Kode sumber (`api/absensi.php`, PDO) |
|-------|-------------------------------|--------------------------------------|
| Koneksi | `mysqli_connect($host, $user, $pass, $db)` → `$koneksi` | `new PDO($dsn, $user, $pass, $options)` → `$pdo` |
| Query | String digabung langsung (`"... WHERE id = '$id'"`) | Prepared statements (`WHERE id = :id` + `execute(['id' => $id])`) |
| Keamanan | Rentan **SQL injection** jika input tidak di-escape | Aman by default (parameter terpisah dari query) |
| Input | `$_POST` / `$_GET` mentah | `getInput()` (JSON + form) + `validateAbsensi()` ketat |
| Respons | Halaman HTML + `header("Location: ...")` | JSON + HTTP status code (200/201/400/404/422/...) |
| Cocok untuk | Belajar alur CRUD pertama kali | API yang dikonsumsi frontend/Postman |

:::tip 💡 Rekomendasi belajar
Kuasai alur mysqli dulu (Pertemuan 2–4) agar paham konsepnya, lalu **pakai pola PDO untuk proyek nyata**. Jangan men-deploy kode query-string-gabungan ke production.
:::

:::warning ⚠️ Catatan kode sumber
`edit.php`/`hapus.php` di proyek asli memakai gaya mysqli lama dan mengasumsikan `index.php` berupa daftar HTML — padahal `index.php` saat ini me-redirect ke API. Contoh di Pertemuan 4 sudah disederhanakan agar konsisten; halaman ini mendokumentasikan kode **apa adanya**.
:::

## ➡️ Lanjut

Kembali ke [ringkasan proyek](./) atau lanjut ke [MVC](/miniclass/backend/mvc/apa-itu-mvc) untuk merapikan kode prosedural ini ke pola Model-View-Controller.

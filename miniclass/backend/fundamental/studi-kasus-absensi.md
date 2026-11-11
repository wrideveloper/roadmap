# 🧪 Studi Kasus: Mini Proyek REST API Absensi

Capstone fundamental: bangun **RESTful API absensi mahasiswa (`db_absensi` / `tb_absensi`) yang utuh dan siap pakai** menggunakan PHP Native modern (PDO + Prepared Statements + Router).

---

## 🚀 Yang Akan Kamu Bangun

Sistem backend yang melayani 5 operasi RESTful API berbasis JSON:

- 📖 **GET `/api/absensi`**: Mengambil seluruh daftar absensi mahasiswa
- 🔍 **GET `/api/absensi/{id}`**: Mengambil detail satu data absensi berdasarkan ID
- ➕ **POST `/api/absensi`**: Menambahkan catatan absensi baru (menerima payload JSON)
- ✏️ **PUT `/api/absensi/{id}`**: Memperbarui data absensi mahasiswa
- 🗑️ **DELETE `/api/absensi/{id}`**: Menghapus data absensi mahasiswa

---

## 📁 Struktur File Proyek

```text
wri-absensi-api/
├── .htaccess         # Konfigurasi URL rewrite (untuk Apache / XAMPP / Laragon)
├── koneksi.php       # Koneksi database MySQL memakai PDO + helper db()
├── helpers.php       # Helper pengolahan response JSON & pembacaan input
├── router.php        # Starter engine routing sederhana
├── handlers/
│   └── absensi.php   # Seluruh logika bisnis & query CRUD absensi
└── index.php         # Peta endpoint rute aplikasi
```

| File | Peran |
| :--- | :--- |
| `.htaccess` | Mengarahkan semua request URL di web server Apache (XAMPP/Laragon) agar selalu masuk ke pintu gerbang `index.php`. |
| `koneksi.php` | Membuka koneksi database via PDO dan menyediakan fungsi `db()`. |
| `helpers.php` | Menyediakan fungsi `response()` (JSON seragam) dan `requestInput()` (baca JSON body). |
| `router.php` | Starter template router untuk mencocokkan URL dan HTTP Method ke handler yang sesuai. |
| `handlers/absensi.php` | Berisi fungsi logika CRUD: `getAllAbsensi()`, `getAbsensiById()`, `createAbsensi()`, `updateAbsensi()`, dan `deleteAbsensi()`. |
| `index.php` | Tempat mendaftarkan rute (routing map) dan menjalankan aplikasi via `run()`. |

---

## 🛠️ Langkah Pengerjaan

### 1. Siapkan Database dan Tabel

Buka MySQL (via phpMyAdmin, MySQL CLI, atau DBeaver), lalu jalankan perintah berikut:

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

---

### 2. Konfigurasi Server (`.htaccess`)

File `.htaccess` adalah file konfigurasi khusus untuk web server **Apache** (yang dipakai oleh XAMPP dan Laragon).

> **Untuk apa file ini?**  
> Secara default, jika kamu menembak URL `/api/absensi`, Apache akan mencari folder fisik bernama `api/absensi/`. Karena folder itu tidak ada di komputermu, Apache akan menampilkan error 404.  
> 
> File `.htaccess` ini bertugas memerintahkan Apache: *"Jangan cari folder fisik! Tolong alihkan (**rewrite**) semua lalu lintas request ke satu pintu gerbang utama: `index.php`."*

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.php [L,QSA]
</IfModule>
```

---

### 3. File Koneksi Database (`koneksi.php`)
Gunakan PDO (*PHP Data Objects*) yang aman dari SQL Injection:

```php
<?php

$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'db_absensi';

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    error_log('[Database] ' . $e->getMessage());

    http_response_code(500);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['status' => 'error', 'message' => 'Koneksi database gagal.']);
    exit;
}

// Helper agar fungsi handler bisa langsung mengakses PDO
function db(): PDO
{
    global $pdo;
    return $pdo;
}
```

---

### 4. File Helper (`helpers.php`)

Helper ini mengotomatiskan pengiriman format JSON dan pembacaan raw JSON payload:

```php
<?php

function response(int $code, array $payload): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

// Menangkap input dari request (JSON body atau Form Data)
function requestInput(): array
{
    $raw = file_get_contents('php://input');
    $json = json_decode($raw, true);

    if (is_array($json)) {
        return $json;
    }

    return !empty($_POST) ? $_POST : [];
}
```

---

### 5. Starter Router Engine (`router.php`)

:::info 💡 Starter Template
File `router.php` ini disediakan sebagai alat bantu agar kita bisa mendefinisikan rute modern tanpa perlu menginstal *library* pihak ketiga. Kamu cukup memasukkannya ke dalam proyek tanpa perlu mengubah isinya.
:::

```php
<?php
require_once __DIR__ . '/helpers.php';

$routes = [];

function route(string $method, string $path, $handler): void
{
    global $routes;
    $routes[] = [
        'method'  => strtoupper($method),
        'path'    => '/' . trim($path, '/'),
        'handler' => $handler,
    ];
}

function get(string $path, $handler): void    { route('GET', $path, $handler); }
function post(string $path, $handler): void   { route('POST', $path, $handler); }
function put(string $path, $handler): void    { route('PUT', $path, $handler); }
function delete(string $path, $handler): void { route('DELETE', $path, $handler); }

function run(): void
{
    global $routes;

    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    $requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($requestMethod === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    $rawUri = $_SERVER['REQUEST_URI'] ?? '/';
    $requestUri = parse_url($rawUri, PHP_URL_PATH);

    // Deteksi otomatis jika dijalankan di subfolder (misal Apache XAMPP/Laragon)
    $scriptName = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    if ($scriptName !== '/' && $scriptName !== '.' && $scriptName !== '') {
        if (str_starts_with($requestUri, $scriptName)) {
            $requestUri = substr($requestUri, strlen($scriptName));
        }
    }

    $requestUri = '/' . trim($requestUri, '/');
    $pathMatched = false;

    foreach ($routes as $r) {
        $pattern = preg_replace('/\{[a-zA-Z0-9_]+\}/', '([^/]+)', $r['path']);
        $pattern = '#^' . $pattern . '$#';

        if (preg_match($pattern, $requestUri, $matches)) {
            $pathMatched = true;

            if ($r['method'] === $requestMethod) {
                array_shift($matches);
                $result = call_user_func_array($r['handler'], $matches);

                if (is_array($result)) {
                    response(200, $result);
                }
                return;
            }
        }
    }

    if ($pathMatched) {
        response(405, [
            'status'  => 'error',
            'message' => "Method $requestMethod tidak diizinkan untuk endpoint ini."
        ]);
    }

    response(404, [
        'status'  => 'error',
        'message' => 'Endpoint tidak ditemukan.'
    ]);
}
```

---

### 6. Peta Rute (`index.php`)

File ini sangat ringkas karena hanya memetakan URL dan method ke fungsi handler:

```php
<?php

require_once __DIR__ . '/koneksi.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/router.php';

// Load handler absensi
require_once __DIR__ . '/handlers/absensi.php';

// ============================================================================
// DAFTAR ENDPOINT API (Routing Map)
// ============================================================================
get('/api/absensi',         'getAllAbsensi');
get('/api/absensi/{id}',    'getAbsensiById');
post('/api/absensi',        'createAbsensi');
put('/api/absensi/{id}',    'updateAbsensi');
delete('/api/absensi/{id}', 'deleteAbsensi');

// Jalankan Router
run();
```

---

### 7. Kerangka Handler CRUD (`handlers/absensi.php`)

Buat folder `handlers/`, lalu buat file `absensi.php`. File ini adalah **area live coding utama** yang akan kita bangun bersama-sama di kelas:

```php
<?php

// Helper validasi input (DRY: digunakan bersama oleh create & update)
function validateAbsensi(array $input): array
{
    // TODO: 1. Cek apakah field wajib (nama, nim, status, tanggal) kosong menggunakan empty()
    // TODO: 2. Jika ada yang kosong, kirim response 422 Unprocessable
    // TODO: 3. Jika lengkap, kembalikan array datanya
}

// [GET] /api/absensi - Mengambil seluruh data absensi
function getAllAbsensi(): void
{
    // TODO: 1. Jalankan query SELECT * FROM tb_absensi
    // TODO: 2. Kirim response JSON dengan status 200 OK
}

// [GET] /api/absensi/{id} - Mengambil satu data absensi berdasarkan ID
function getAbsensiById($id): void
{
    // TODO: 1. Validasi parameter $id (harus integer positif)
    // TODO: 2. Query data berdasarkan id
    // TODO: 3. Kirim 404 jika tidak ditemukan, atau 200 jika data ada
}

// [POST] /api/absensi - Menambahkan data absensi baru
function createAbsensi(): void
{
    // TODO: 1. Ambil payload JSON dari body request via requestInput()
    // TODO: 2. Validasi field wajib, enum status, dan batas karakter
    // TODO: 3. Jalankan query INSERT INTO tb_absensi
    // TODO: 4. Kirim response 201 Created jika berhasil
}

// [PUT] /api/absensi/{id} - Memperbarui data absensi
function updateAbsensi($id): void
{
    // TODO: 1. Cek apakah ID ada di database
    // TODO: 2. Validasi input pembaruan
    // TODO: 3. Jalankan query UPDATE tb_absensi WHERE id = :id
    // TODO: 4. Kirim response 200 OK
}

// [DELETE] /api/absensi/{id} - Menghapus data absensi
function deleteAbsensi($id): void
{
    // TODO: 1. Jalankan query DELETE FROM tb_absensi WHERE id = :id
    // TODO: 2. Cek apakah ada baris yang terhapus (rowCount)
    // TODO: 3. Kirim response 200 OK atau 404 Not Found
}
```

---

## ⚡ Menjalankan Server & Uji Coba

Buka terminal di folder proyek kamu, lalu jalankan server PHP bawaan:

```bash
php -S localhost:8000 index.php
```

Uji setiap endpoint menggunakan **Postman**, **Thunder Client (VS Code)**, atau **Hoppscotch**:

### 1. Menambah Absensi (`POST /api/absensi`)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/absensi`
- **Header:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "nama": "Andi Saputra",
    "nim": "244107020050",
    "status": "Hadir",
    "tanggal": "2026-11-08"
  }
  ```
- **Respon yang diharapkan:** Status `201 Created`

### 2. Mengambil Semua Absensi (`GET /api/absensi`)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/absensi`
- **Respon yang diharapkan:** Status `200 OK` berisi array daftar absensi.

### 3. Mengambil Detail Absensi (`GET /api/absensi/1`)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/absensi/1`
- **Respon yang diharapkan:** Status `200 OK` (atau `404 Not Found` jika ID tidak ada).

### 4. Mengubah Absensi (`PUT /api/absensi/1`)
- **Method:** `PUT`
- **URL:** `http://localhost:8000/api/absensi/1`
- **Body (raw JSON):**
  ```json
  {
    "nama": "Andi Saputra",
    "nim": "244107020050",
    "status": "Sakit",
    "tanggal": "2026-11-08"
  }
  ```
- **Respon yang diharapkan:** Status `200 OK`.

### 5. Menghapus Absensi (`DELETE /api/absensi/1`)
- **Method:** `DELETE`
- **URL:** `http://localhost:8000/api/absensi/1`
- **Respon yang diharapkan:** Status `200 OK`.

---

## ✅ Checklist Selesai

- [ ] Database `db_absensi` dan tabel `tb_absensi` berhasil dibuat
- [ ] Server PHP berjalan normal via `php -S localhost:8000 index.php`
- [ ] Endpoint `POST /api/absensi` berhasil menyimpan data baru (HTTP `201`)
- [ ] Endpoint `GET /api/absensi` menampilkan seluruh data dalam format JSON (HTTP `200`)
- [ ] Endpoint `GET /api/absensi/{id}` menampilkan detail satu data (HTTP `200` atau `404`)
- [ ] Endpoint `PUT /api/absensi/{id}` berhasil mengubah data yang ada (HTTP `200`)
- [ ] Endpoint `DELETE /api/absensi/{id}` berhasil menghapus data (HTTP `200`)
- [ ] Validasi bekerja jika field kosong atau status tidak sesuai (HTTP `422`)

---

## 🚀 Tantangan Berikutnya

Selamat! Kamu sudah berhasil membangun RESTful API pertama kamu menggunakan PHP Native. Konsep ini adalah batu loncatan yang sangat penting sebelum masuk ke tahap:
- Memahami konsep arsitektur [MVC (Model-View-Controller)](/miniclass/backend/mvc/apa-itu-mvc)
- Mengembangkan REST API menggunakan framework modern [Laravel](/miniclass/backend/laravel/apa-itu-laravel)

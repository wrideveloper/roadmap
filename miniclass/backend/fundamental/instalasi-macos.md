# 🍎 Instalasi & Setup Database (macOS)

Panduan setup lingkungan Backend PHP + MySQL untuk pengguna **MacBook (macOS)** memakai **Homebrew** (disarankan) atau **XAMPP** (alternatif GUI). Pengguna Windows memakai Laragon sesuai [Database](/miniclass/backend/fundamental/database).

## Metode 1: Homebrew (Rekomendasi Utama)

Homebrew adalah *package manager* paling populer di macOS untuk menginstal perangkat lunak lewat Terminal.

### Langkah 1: Install Homebrew (jika belum ada)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Ikuti instruksi di layar (masukkan password Mac jika diminta), lalu ikuti perintah *Next Steps* di terminal untuk mendaftarkan `brew` ke PATH.

### Langkah 2: Install PHP & MySQL

```bash
brew install php
brew install mysql
```

### Langkah 3: Nyalakan layanan MySQL

```bash
brew services start mysql
```

Untuk menghentikannya: `brew services stop mysql`.

### Langkah 4: Buat database

1. Masuk ke MySQL sebagai root (biasanya tanpa password di awal):

   ```bash
   mysql -u root
   ```

2. Buat database proyek absensi:

   ```sql
   CREATE DATABASE db_absensi;
   ```

3. Keluar:

   ```sql
   EXIT;
   ```

4. Buat tabelnya dengan perintah `CREATE TABLE tb_absensi` di [Database](/miniclass/backend/fundamental/database) atau [MySQL](/miniclass/backend/fundamental/mysql).

## Metode 2: XAMPP for macOS (Alternatif GUI)

Jika lebih nyaman dengan panel grafis (mirip Laragon di Windows):

1. **Download** installer XAMPP untuk macOS dari [Apache Friends](https://www.apachefriends.org/) — pilih arsitektur yang sesuai (Intel atau Apple Silicon M1/M2/M3).
2. **Instalasi:** buka file `.dmg`, geser ikon XAMPP ke folder **Applications**.
3. **Nyalakan server:** buka XAMPP → tab **Manage Servers** → Start **Apache Web Server** dan **MySQL Database**.
4. **Buat database:** buka `http://localhost/phpmyadmin/` di browser, buat database `db_absensi`.

## Konfigurasi `koneksi.php`

Sesuaikan kredensial dengan setup Mac (user default biasanya `root` tanpa password):

```php
<?php
$host = "localhost";
$user = "root";   // Default user MySQL di Mac biasanya "root"
$pass = "";       // Kosongkan jika tanpa password (atau "root" di MAMP/XAMPP lama)
$db   = "db_absensi";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}
?>
```

## Troubleshooting Umum di MacBook

- **`Access denied for user 'root'@'localhost'`** — reset password root Homebrew:

  ```bash
  brew services stop mysql
  mysqld_safe --skip-grant-tables &
  mysql -u root
  ```

  Lalu jalankan query SQL untuk mengubah password root.

- **Perintah `php` tidak dikenali** — pastikan Homebrew masuk ke PATH (`~/.zshrc`):

  ```bash
  export PATH="/opt/homebrew/bin:$PATH"
  ```

  Lalu `source ~/.zshrc`.

## ➡️ Lanjut

Kembali ke [Database](/miniclass/backend/fundamental/database) untuk mulai membuat tabel `tb_absensi`.

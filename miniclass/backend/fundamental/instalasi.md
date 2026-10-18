# 🛠️ Instalasi & Setup Lingkungan

Panduan setup lingkungan Backend PHP + MySQL untuk **Windows**, **macOS**, dan **Linux**. Di akhir panduan ini kamu punya server database berjalan + database `db_absensi`, siap lanjut ke [Database](/miniclass/backend/fundamental/database).

## Yang Diinstal

| Komponen | Fungsi |
|----------|--------|
| **PHP** | Menjalankan kode server-side |
| **MySQL / MariaDB** | Server database |
| **Web server** (Apache) | Menyajikan file PHP ke browser |
| **phpMyAdmin** (opsional) | Kelola database lewat browser |

| Sistem Operasi | Cara disarankan |
|----------------|-----------------|
| Windows | [Laragon](#windows-laragon-disarankan) |
| macOS | [Homebrew](#macos-homebrew-disarankan) atau XAMPP |
| Linux (Ubuntu/Debian) | [Paket `apt`](#linux-paket-apt) |

### 📚 Sumber & Unduhan Resmi

| Perangkat | Situs resmi |
|-----------|-------------|
| Laragon | [laragon.org](https://laragon.org) |
| Homebrew | [brew.sh](https://brew.sh/) |
| XAMPP (Apache Friends) | [apachefriends.org](https://www.apachefriends.org/) |
| PHP | [php.net](https://www.php.net/) |
| MySQL | [dev.mysql.com](https://dev.mysql.com/downloads/) |
| MariaDB | [mariadb.org](https://mariadb.org/) |
| Apache HTTP Server | [httpd.apache.org](https://httpd.apache.org/) |
| phpMyAdmin | [phpmyadmin.net](https://www.phpmyadmin.net/) |

## Windows: Laragon (Disarankan)

1. **Download & instal Laragon** dari [situs resminya](https://laragon.org) (pilih versi Full agar sudah termasuk Apache, MySQL, PHP, dan phpMyAdmin).
2. **Nyalakan layanan** — buka control panel Laragon, klik **Start All** (menyalakan Apache + MySQL/MariaDB).
3. **Buka phpMyAdmin** di browser: `http://localhost/phpmyadmin/`
4. **Buat database** `db_absensi` (klik *New* → isi nama → *Create*).
5. File PHP diletakkan di folder root Laragon (misalnya `D:\laragon\www\`) dan diakses via `http://localhost/nama-folder/`.

## macOS: Homebrew (Disarankan)

Homebrew adalah *package manager* paling populer di macOS untuk menginstal perangkat lunak lewat Terminal — lihat [brew.sh](https://brew.sh/).

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

```bash
mysql -u root
```

```sql
CREATE DATABASE db_absensi;
EXIT;
```

*(Biasanya di Mac, root awal tidak memerlukan password.)*

## macOS: XAMPP (Alternatif GUI)

Jika lebih nyaman dengan panel grafis (mirip Laragon di Windows):

1. **Download** installer XAMPP untuk macOS dari [Apache Friends](https://www.apachefriends.org/) — pilih arsitektur yang sesuai (Intel atau Apple Silicon M1/M2/M3).
2. **Instalasi:** buka file `.dmg`, geser ikon XAMPP ke folder **Applications**.
3. **Nyalakan server:** buka XAMPP → tab **Manage Servers** → Start **Apache Web Server** dan **MySQL Database**.
4. **Buat database:** buka `http://localhost/phpmyadmin/` di browser, buat database `db_absensi`.

## Linux: Paket `apt` (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install apache2 mysql-server php php-mysqli
```

Nyalakan dan aktifkan layanan:

```bash
sudo systemctl start apache2 mysql
sudo systemctl enable apache2 mysql
```

Amankan instalasi MySQL (atur password root / hapus user anonim):

```bash
sudo mysql_secure_installation
```

Buat database (masukkan password root yang baru dibuat):

```bash
sudo mysql -u root -p -e "CREATE DATABASE db_absensi;"
```

:::tip 💡 MariaDB vs MySQL
Di distro Linux modern, paket `mysql-server` sering berupa **[MariaDB](https://mariadb.org/)** — sepenuhnya kompatibel untuk materi ini (perintah SQL-nya sama).
:::

## ✅ Verifikasi Instalasi

| Cek | Perintah / alamat | Hasil yang diharapkan |
|-----|-------------------|----------------------|
| PHP | `php -v` | Menampilkan versi, misalnya `PHP 8.x` |
| MySQL | `mysql --version` | Menampilkan versi MySQL/MariaDB |
| Web server | `http://localhost/` di browser | Halaman default Apache/Laragon |
| phpMyAdmin | `http://localhost/phpmyadmin/` | Login dan terlihat database `db_absensi` |

Selanjutnya buat tabelnya dengan perintah `CREATE TABLE tb_absensi` di [Database](/miniclass/backend/fundamental/database) atau [MySQL](/miniclass/backend/fundamental/mysql).

## Konfigurasi `koneksi.php`

Sesuaikan kredensial dengan setup masing-masing OS:

| Setup | `$user` | `$pass` |
|-------|---------|---------|
| Laragon (Windows) | `root` | kosongkan (`""`) |
| XAMPP (macOS/Windows) | `root` | kosongkan (`""`) |
| Homebrew (macOS) | `root` | kosongkan (`""`) |
| Linux (`apt` + `mysql_secure_installation`) | `root` | password yang kamu atur |

```php
<?php
$host = "localhost";
$user = "root";
$pass = "";             // isi password jika setup Linux / jika root berpassword
$db   = "db_absensi";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}
?>
```

## Troubleshooting Umum

- **`Access denied for user 'root'@'localhost'`** — password salah atau root memakai plugin `auth_socket` (umum di Linux/Homebrew):
  - Linux: masuk via `sudo mysql`, lalu atur password atau buat user khusus:
    ```sql
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password-baru';
    FLUSH PRIVILEGES;
    ```
  - Homebrew (lupa password): `brew services stop mysql`, lalu `mysqld_safe --skip-grant-tables &` dan `mysql -u root` untuk reset.
- **Perintah `php`/`mysql` tidak dikenali** — pastikan direktori instalasi masuk PATH:
  - macOS (Homebrew, `~/.zshrc`): `export PATH="/opt/homebrew/bin:$PATH"`, lalu `source ~/.zshrc`.
  - Windows: tambahkan folder `php`/`mysql/bin` Laragon atau XAMPP ke *Environment Variables → Path*.
  - Linux: instalasi via `apt` sudah masuk PATH otomatis — jika tidak ketemu, pastikan paketnya terinstal (`php -v`).
- **Port bentrok (Apache tidak mau start)** — port 80/443 dipakai aplikasi lain (umum di Windows/XAMPP): hentikan aplikasi tersebut atau ganti port Apache di konfigurasi.
- **Port 3306 bentrok (MySQL tidak mau start)** — dua server MySQL berjalan bersamaan (misalnya Laragon + XAMPP, atau service + manual): matikan salah satunya.
- **Layanan mati setelah restart (Linux)** — pastikan *enabled*: `sudo systemctl enable apache2 mysql`.

## ➡️ Lanjut

Kembali ke [Database](/miniclass/backend/fundamental/database) untuk mulai membuat tabel `tb_absensi`.

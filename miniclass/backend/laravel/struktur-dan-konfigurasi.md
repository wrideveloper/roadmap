# Struktur Folder & Konfigurasi Dasar

Setelah kamu berhasil menginstal Laravel, mungkin kamu akan sedikit kaget melihat begitu banyak folder dan file yang otomatis ter-generate. Jangan panik! Kamu tidak perlu menghafal atau menggunakan semuanya sekaligus.

Untuk level dasar ini, ada tiga hal penting yang wajib banget kamu ketahui sebelum lanjut ngoding: **Struktur Folder Utama**, **File `.env`**, dan **Artisan Console**.

## 1. Tiga Folder Paling Sering Dikunjungi

Dari puluhan folder yang ada, untuk pemula kamu hanya akan bolak-balik di 3 tempat ini:

*   📂 **`app/`**: Ini adalah "otak" aplikasimu.
    *   `app/Models/`: Tempat kamu menyimpan file Model (koki database).
    *   `app/Http/Controllers/`: Tempat kamu menyimpan file Controller (pelayan logika).
*   📂 **`routes/`**: Tempat mendaftarkan alamat URL (resepsionis).
    *   `routes/web.php`: Untuk aplikasi web biasa yang pakai HTML/Blade.
    *   `routes/api.php`: Khusus untuk jalur REST API.
*   📂 **`database/migrations/`**: Tempat kamu menyimpan instruksi untuk merancang tabel database.

## 2. Rahasia Dapur: File `.env`

Coba cari file bernama **`.env`** di direktori paling luar (root) project-mu. File ini ibarat "buku rahasia" aplikasimu.

**Fungsi `.env`:**
File ini digunakan untuk menyimpan konfigurasi penting yang bersifat rahasia dan spesifik untuk komputermu saja. Misalnya: Password database, alamat server, atau kunci API pihak ketiga.

**Kenapa harus di `.env`?**
File ini **tidak akan pernah ikut ter-upload ke GitHub** (sudah diblokir oleh `.gitignore`). Jadi, password databasemu aman dan tidak bisa diintip oleh orang asing di internet.

### Menghubungkan ke Database MySQL

Sebelum kamu bisa menjalankan Migration, kamu WAJIB memberitahu Laravel di mana databasemu berada. Buka file `.env` dan cari blok tulisan `DB_CONNECTION`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_kamu
DB_USERNAME=root
DB_PASSWORD=password_database_kamu
```

*   **`DB_DATABASE`**: Ganti dengan nama database yang sudah kamu buat di phpMyAdmin atau TablePlus.
*   **`DB_USERNAME`**: Biasanya `root` (kalau pakai XAMPP/Herd).
*   **`DB_PASSWORD`**: Kosongkan (tulis `DB_PASSWORD=` tanpa spasi) jika MySQL-mu tidak dipasang password, atau isi sesuai password komputermu.

> [!WARNING]
> Setiap kali kamu mengubah file `.env`, kadang server butuh direstart (`CTRL + C` lalu `php artisan serve` lagi) agar perubahan kuncinya terbaca.

## 3. Apa itu Artisan Console?

Dari tadi kita sering banget nulis perintah berawalan `php artisan...` di terminal. Sebenarnya itu apa sih?

**Artisan** adalah asisten virtual bawaan Laravel. Dia bisa disuruh melakukan pekerjaan repetitif yang membosankan.

Daripada kamu bikin file PHP kosong, ngasih nama *class*, lalu ngetik struktur dasarnya manual satu per satu, kamu tinggal suruh asistenmu:

*   *"Buatin file Controller buat Siswa dong!"* -> `php artisan make:controller SiswaController`
*   *"Buatin struktur tabel database dong!"* -> `php artisan make:migration create_siswa_table`
*   *"Tolong jalankan server lokal dong!"* -> `php artisan serve`

Kamu bisa melihat daftar SEMUA perintah yang bisa dilakukan Artisan dengan mengetik `php artisan list` di terminalmu.

---

Nah, sekarang kamu sudah tahu di mana harus naruh file, gimana cara konek ke database, dan siapa itu Artisan. Kamu sudah sangat siap untuk membedah arsitektur Laravel di bab selanjutnya!

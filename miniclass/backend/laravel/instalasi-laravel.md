# Kebutuhan Laravel / Instalasi Laravel

Sebelum mulai membuat *project* Laravel, ada beberapa hal yang perlu kamu siapkan. Saat ini, proses instalasi bisa dilakukan dengan cara mengumpulkan alatnya satu per satu, atau menggunakan *environment* modern yang serba otomatis.

## Cara Modern & Paling Praktis: Laravel Herd

Jika kamu tidak ingin pusing menginstal PHP, Composer, dan Node.js secara terpisah, cara terbaik dan paling direkomendasikan saat ini adalah menggunakan **Laravel Herd**.

<img src="https://herd.laravel.com/images/appicon.png" style="border-radius: 20px;" alt="gambar-logo-laravel" width=256></img>

**Apa itu Laravel Herd?**
Herd adalah *local development environment* yang sangat cepat dan ringan (tersedia untuk macOS dan Windows). Herd sudah membungkus PHP, Composer, dan Node.js di dalam satu paket. Kamu hanya perlu menginstal satu aplikasi ini, dan komputermu langsung siap dipakai untuk *ngoding* Laravel tanpa konfigurasi *environment variables* yang merepotkan!

Kamu bisa mengunduhnya secara gratis di: [herd.laravel.com](https://herd.laravel.com).

---

## Persiapan Tools Manual (Prerequisites)

Jika kamu lebih suka mengatur *environment* komputermu secara mandiri (misalnya kamu menggunakan Linux atau memiliki *setup* spesifik), berikut adalah *tools* utama yang wajib kamu siapkan:

1. **PHP:** Bahasa pemrograman utama Laravel. Berdasarkan dokumentasi terbaru Laravel, cara paling cepat dan mudah untuk menginstal PHP di berbagai sistem operasi adalah melalui skrip interaktif di **[php.new/install](https://php.new/install)**. Kita dapat juga menggunakan [XAMPP](https://www.apachefriends.org/) maupun [Laragon](https://laragon.org)
2. **Composer:** *Package manager* untuk PHP (seperti NPM pada Node.js) yang bertugas mengunduh kerangka Laravel. Kamu bisa mengunduhnya di [getcomposer.org](https://getcomposer.org).
3. **Node.js & NPM:** Digunakan untuk mengelola aset *frontend* seperti CSS dan JavaScript. Unduh di [nodejs.org](https://nodejs.org).
4. **Database:** Kamu bisa menggunakan MySQL, PostgreSQL, atau SQLite untuk menyimpan data. (Sebagai catatan, Laravel versi terbaru secara *default* akan menggunakan SQLite agar kamu bisa langsung mulai tanpa harus men-*setup* server database terpisah).

---

## Langkah-langkah Instalasi Project

Jika *tools* di atas sudah siap (atau kamu sudah menggunakan Laravel Herd), kamu bisa langsung membuat *project* Laravel baru melalui terminal / *command prompt*.

1. Buka terminal komputermu.
2. Jalankan perintah Composer berikut untuk membuat *project*:

   ```bash
   composer create-project laravel/laravel nama-project
   ```

> [!NOTE]
> kamu bisa mengganti nama-project dengan nama aplikasi yang sedang kamu buat.

3\. Masuk ke dalam folder project yang baru saja dibuat:

```bash
cd nama-project
```

4\. Jalankan server development bawaan dari Laravel agar web kamu bisa dibuka di browser:

```bash
php artisan serve
```

Setelah perintah terakhir dijalankan, terminal akan memberikan sebuah URL (biasanya <http://localhost:8000>). Buka URL tersebut di browser, dan selamat, instalasi Laravel kamu berhasil!

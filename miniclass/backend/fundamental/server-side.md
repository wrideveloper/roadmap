# 🖥️ Pengenalan Server Side Programming

## 📚 Apa itu Server Side Programming?

**Server side programming** atau pemrograman sisi server adalah program yang berjalan di **server** yang menangani pembuatan konten halaman website.

:::warning ⚠️ Perbedaan Penting
- **Server Side** = Berjalan di **server**
- **Client Side** = Berjalan di **web browser** pengguna
:::

<div align="center">

![Server Side Programming](/miniclass/backend/assets/ssp.png)

*Diagram alur Server Side Programming*

</div>

## 🔧 Tugas Backend Developer

Para pengembang sisi server akan:

1. 🏗️ **Merancang** arsitektur sistem
2. 💻 **Membangun** kode aplikasi
3. 🔧 **Memelihara** sistem agar berjalan optimal

## ⚡ Fungsi Server Side Programming

| Fungsi | Deskripsi |
|--------|----------|
| 📥 **Input Processing** | Memproses input dari user |
| 💾 **Database Interaction** | Berinteraksi dengan database |
| 🎯 **Content Control** | Mengontrol konten yang disajikan |
| 📤 **Response Handler** | Mengirim respon ke client |

## 🔐 HTTP & HTTPS

<div align="center">

![HTTP vs HTTPS](/miniclass/backend/assets/httphttps.png)

</div>

### 📡 HTTP (Hypertext Transfer Protocol)

**HTTP** adalah protokol jaringan yang digunakan untuk mentransfer data di web.

:::info ℹ️ Cara Kerja HTTP
Saat kita mengunjungi sebuah situs, HTTP memungkinkan browser berkomunikasi dengan server untuk meminta data seperti teks, gambar, atau video.
:::

#### ⚠️ Kekurangan HTTP:
- ❌ **Stateless** - Tidak menyimpan informasi tentang interaksi sebelumnya
- ❌ **Insecure** - Data tidak dienkripsi
- ❌ **Vulnerable** - Data bisa dilihat pihak ketiga jika terjadi penyadapan

### 🔒 HTTPS (Hypertext Transfer Protocol Secure)

**HTTPS** adalah versi **aman** dari HTTP yang menggunakan enkripsi.

#### ✅ Keunggulan HTTPS:
- ✅ **Encrypted** - Menggunakan SSL/TLS untuk enkripsi data
- ✅ **Secure** - Informasi terlindungi dari pihak ketiga
- ✅ **Trusted** - Cocok untuk login, pembayaran, dan data pribadi

:::tip 💡 Best Practice
Selalu gunakan **HTTPS** untuk website yang menangani data sensitif pengguna!
:::

## 🔄 Alur Request: Contoh Absensi

Teori request/response di atas terlihat konkret pada aplikasi absensi (`tb_absensi`):

**Create (form → server → database):**

1. 🖱️ User mengisi [form absensi](/miniclass/backend/fundamental/html) lalu klik Simpan → browser mengirim `POST` ke server.
2. 🖥️ PHP di server membaca `$_POST`, menjalankan `INSERT` via `koneksi.php` (lihat [PHP](/miniclass/backend/fundamental/php)).
3. 📤 Server menjawab dengan redirect (`header("Location: index.php")`) → browser memuat ulang daftar.

**Read (server → database → tabel):**

1. 🌐 Browser meminta halaman daftar (`GET`).
2. 🖥️ PHP menjalankan `SELECT * FROM tb_absensi`, me-render tiap baris menjadi `<tr>` dalam tabel HTML.
3. 📤 Server mengirim HTML jadi → browser menampilkannya. Tidak ada SQL yang terlihat klien — sesuai prinsip *Input Processing* → *Database Interaction* → *Response Handler* di tabel fungsi di atas.
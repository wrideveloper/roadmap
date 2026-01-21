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
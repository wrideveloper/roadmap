# Minggu 2: Passive Reconnaissance dan OSINT

## Apa Itu Passive Recon

Passive recon adalah proses mengumpulkan informasi tentang target **tanpa menyentuh sistem target sama sekali**. Kamu menggunakan informasi yang sudah tersedia untuk umum — dokumentasi publik, catatan DNS, metadata dokumen — untuk membangun gambaran awal sebelum melakukan apapun ke sistem tersebut.

Tujuannya bukan mengumpulkan informasi sebanyak mungkin, tapi membangun konteks yang cukup untuk membuat pengujian selanjutnya lebih terarah.

---

## Passive Recon vs Active Recon

Ini perbedaan yang paling mendasar dan wajib kamu pahami sebelum lanjut.

| | Passive Recon | Active Recon |
| --- | --- | --- |
| Menyentuh target? | Tidak | Ya |
| Sumber data | Informasi publik yang sudah ada | Response langsung dari sistem target |
| Tujuan | Membangun hipotesis awal | Memverifikasi keberadaan service secara nyata |
| Risiko terdeteksi | Sangat rendah | Lebih tinggi |
| Contoh | Membaca dokumentasi publik, melihat metadata file | Port scanning, mengirim request ke server |

Passive recon dilakukan **sebelum** active recon. Minggu ini hanya membahas passive recon — active recon ada di minggu berikutnya.

---

## Kenapa Ini Penting

Tanpa passive recon, kamu masuk ke sistem tanpa konteks. Kamu tidak tahu teknologi apa yang dipakai, layanan apa yang mungkin ada, atau area mana yang layak diuji. Hasilnya kamu akan membuang waktu menguji hal yang salah.

Passive recon yang baik membantu kamu:

- Menebak teknologi yang dipakai target sebelum menyentuhnya
- Menemukan titik-titik menarik seperti subdomain, portal login, atau panel admin
- Membuat pengujian selanjutnya jauh lebih efisien

---

## Sumber Informasi

:::warning
Di kelas ini kita tidak melakukan OSINT terhadap target nyata. Semua praktikum menggunakan **mock target packet** yang sudah disiapkan mentor. Jangan keluar dari packet yang diberikan selama sesi berlangsung.
:::

Di dunia nyata, sumber passive recon bisa berupa catatan WHOIS, DNS publik, arsip web, metadata dokumen, atau informasi dari situs resmi organisasi. Di kelas ini, semua itu disimulasikan dalam satu packet latihan.

---

## Confidence Level

Setiap informasi yang kamu temukan harus diberi label seberapa yakin kamu dengan informasi tersebut. Ini bukan formalitas — ini yang membedakan catatan recon yang bisa dipercaya dari yang asal tulis.

| Label | Artinya | Contoh |
| --- | --- | --- |
| **Confirmed** | Ada bukti langsung | Domain utama tercantum eksplisit di packet |
| **Likely** | Ada indikasi yang mendukung, tapi belum pasti | Ekstensi `.php` muncul di beberapa URL contoh |
| **Unknown** | Tidak ada cukup petunjuk | Tidak ada informasi apapun tentang database yang dipakai |

:::info
Kalau kamu belum memverifikasi langsung, jangan tulis "target **menggunakan** WordPress". Tulis "target **kemungkinan** menggunakan WordPress berdasarkan indikasi X". Kebiasaan ini penting untuk keandalan laporanmu ke depan.
:::

---

## Format Catatan Recon

Gunakan format ini setiap kali melakukan passive recon, baik di kelas maupun nanti di luar kelas.

| Field | Isi |
| --- | --- |
| Target name | Nama target |
| Known domains | Domain yang sudah dikonfirmasi |
| Suspected subdomains | Subdomain yang diduga ada |
| Technology clues | Petunjuk stack seperti Nginx, WordPress, React |
| Email pattern | Dugaan format email |
| Public services | Layanan yang kemungkinan tersedia |
| Confidence | Confirmed / Likely / Unknown untuk tiap informasi |

---

## Menyusun Hipotesis

Setelah informasi terkumpul, langkah selanjutnya adalah menyusun hipotesis — dugaan yang masuk akal berdasarkan bukti yang ada, dan bisa diverifikasi di fase berikutnya.

Hipotesis yang baik memenuhi tiga syarat ini:

1. Ada alasan yang bisa dijelaskan: *"karena saya melihat..."*
2. Spesifik, bukan sekadar *"mungkin ada sesuatu"*
3. Bisa diverifikasi lewat active recon

**Contoh hipotesis yang baik:**
- Target kemungkinan punya portal login di subdomain `admin.`, karena ada referensi ke *"dashboard management"* di dokumentasi publik mereka
- Aplikasi target kemungkinan berbasis PHP, karena ekstensi `.php` muncul di beberapa contoh URL pada packet
- Kemungkinan ada panel admin yang hanya bisa diakses internal, karena tidak ada link ke halaman tersebut di navigasi publik

---

## Praktikum

### Yang Kamu Butuhkan
- Mock target packet dari mentor
- Template catatan recon (terlampir)
- Lembar kerja hipotesis (terlampir)

### Langkah-langkah

**1. Baca target packet dari awal sampai akhir**
Jangan langsung mencatat. Baca dulu semuanya untuk mendapat gambaran besar sebelum mulai menganalisis.

**2. Catat informasi dasar**
Dari packet, identifikasi:
- Nama target
- Domain utama
- Minimal dua petunjuk teknologi
- Pola format email, kalau ada
- Subdomain yang disebutkan atau dihintkan

**3. Beri label confidence pada setiap informasi**
Tandai setiap informasi dengan **Confirmed**, **Likely**, atau **Unknown**. Jangan lewatkan langkah ini.

**4. Susun minimal tiga hipotesis**
Tulis hipotesisnya, dasarnya dari mana, dan bagaimana cara memverifikasinya nanti.

---

## Deliverables

- Tabel catatan recon yang sudah terisi lengkap dengan label confidence
- Minimal tiga hipotesis beserta alasannya

---

## Kesalahan yang Sering Terjadi

- Menyalin semua informasi dari packet tanpa memilah mana yang relevan
- Menulis hipotesis sebagai fakta tanpa dasar yang jelas
- Langsung pindah ke scanning sebelum konteks target cukup jelas
- Tidak mencatat dari mana setiap informasi ditemukan

---

## Homework

- Periksa kembali catatan recon yang sudah kamu buat — apakah semua label confidence sudah tepat?
- Dari hipotesis yang kamu susun, cara apa yang paling logis untuk memverifikasinya di minggu berikutnya?

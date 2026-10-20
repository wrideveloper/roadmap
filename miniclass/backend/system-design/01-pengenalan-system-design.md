# Mindset dan Pengenalan System Design

::: info Prasyarat Modul
Modul ini ditujukan bagi kamu yang sudah memahami konsep dasar backend: menguasai minimal satu bahasa pemrograman backend (PHP, JavaScript/Node.js, Go, Python, dll.) dan paham alur kerja HTTP/REST API.
:::

Selama belajar backend di level dasar, fokus utama kita biasanya adalah **fungsionalitas**:
- Apakah endpoint API mengembalikan JSON yang benar?
- Apakah data berhasil disimpan ke database saat form di-submit?
- Apakah logika autentikasi login berhasil memvalidasi user?

Namun, begitu aplikasi kamu dilepas ke dunia nyata (*production*), muncul variabel baru yang tidak pernah kamu temui di laptop sendiri: **beban (*load*), lonjakan pengguna serentak (*concurrency*), dan kegagalan jaringan**.

Di sinilah peran **System Design**.

---

## Tragedi "It Works on My Machine"

Bayangkan skenario nyata yang sering bikin frustrasi: **war tiket konser musik** atau *flash sale* tiket event akbar yang dibuka tepat pukul 10.00 pagi.

Di laptop developer saat masa pengembangan, aplikasi berjalan sangat lancar. Latensi 2 milidetik, tidak ada error sama sekali. Namun, saat puluhan ribu penggemar menyerbu tombol "Beli Tiket" di detik pertama:
1. CPU server langsung melonjak ke 100%.
2. RAM habis dan memicu crash *Out of Memory* (OOM).
3. Koneksi database kehabisan *pool* (*Too many connections*).
4. Layar browser pengunjung hanya menampilkan pesan `504 Gateway Timeout` atau berputar-putar tanpa akhir.

<div align="center">

![Localhost vs Production Reality](/miniclass/backend/assets/system-design/01-localhost-vs-production.svg)

</div>

Kode backend-mu mungkin tidak memiliki bug sintaks sama sekali. Namun, sistemnya tumbang karena arsitektur dasarnya belum didesain untuk menangani skala tersebut.

---

## Apa Sebenarnya System Design?

Secara sederhana, **System Design** adalah proses merancang arsitektur, komponen, modul, antarmuka, dan aliran data dari sebuah sistem agar mampu memenuhi kebutuhan pengguna secara andal dan terukur.

Dalam rekayasa perangkat lunak, perancangan sistem biasanya dibagi menjadi dua tingkatan:

### 1. Low-Level Design (LLD)
Fokus pada level kode dan internal aplikasi:
- Struktur *class*, *interface*, dan *design pattern* (seperti Repository Pattern atau Factory Pattern).
- Skema tabel database dan relasinya.
- Penamaan fungsi dan efisiensi algoritma di dalam kode.

### 2. High-Level Design (HLD)
Fokus pada level arsitektur dan infrastruktur makro:
- Bagaimana alur traffic dari browser sampai ke server aplikasi?
- Di mana data disimpan, di-cache, atau diproses secara antrean?
- Bagaimana jika salah satu server tiba-tiba mati terbakar?
- Bagaimana membagi beban kerja ke banyak mesin?

> Analogi sederhana: **HLD adalah perencanaan tata kota** (jalan raya, gardu listrik, pengolahan air), sedangkan **LLD adalah rancangan interior bangunan** (posisi pintu, instalasi kabel kamar, tata letak perabot).

---

## Tiga Metrik Utama: Non-Functional Requirements

Saat membuat aplikasi, kita mengenal istilah **Functional Requirements** (apa yang sistem lakukan, misal: *user bisa login*) dan **Non-Functional Requirements** (seberapa baik sistem melakukannya).

Dalam System Design, ada tiga metrik utama yang wajib kamu pahami:

### 1. Scalability (Skalabilitas)
Kemampuan sistem untuk terus beroperasi dengan baik saat volume data, jumlah user, atau traffic meningkat, cukup dengan menambahkan sumber daya.

### 2. Availability & Reliability
- **Availability**: Persentase waktu sistem dapat diakses pengguna. Sistem dengan kriteria *High Availability* biasanya menargetkan *uptime* minimal `99.9%` (downtime maksimal hanya ~8.7 jam dalam setahun).
- **Reliability**: Seberapa konsisten sistem menjalankan fungsinya tanpa menghasilkan respon error atau data korup di bawah tekanan beban.

### 3. Latency vs Throughput
- **Latency**: Waktu yang dibutuhkan satu request untuk pergi ke server dan kembali membawa jawaban (diukur dalam milidetik/ms).
- **Throughput**: Jumlah request yang mampu diselesaikan oleh sistem dalam satu satuan waktu (biasanya diukur dalam *Requests Per Second* atau RPS).

---

## Bahaya Single Point of Failure (SPOF)

Pola paling umum saat pertama kali mendeploy aplikasi backend adalah menyatukan semuanya ke dalam satu VPS murah:

<div align="center">

![Single Point of Failure Monolith](/miniclass/backend/assets/system-design/02-spof-monolith.svg)

</div>

Kelemahan arsitektur ini: **tidak ada redundansi sama sekali**.
- Jika server web kehabisan memori, database di mesin yang sama ikut terbunuh.
- Jika harddisk server penuh oleh log atau file upload, seluruh sistem lumpuh.
- Jika provider VPS mengalami gangguan jaringan, aplikasi offline 100%.

Inilah yang disebut **Single Point of Failure (SPOF)**: satu titik rawan yang jika gagal, akan menyeret seluruh sistem ikut mati.

---

## Strategi Menghadapi Beban: Vertical vs Horizontal Scaling

Ketika server mulai tercekik oleh lonjakan pengguna, ada dua jalan yang bisa diambil:

<div align="center">

![Vertical vs Horizontal Scaling](/miniclass/backend/assets/system-design/03-vertical-vs-horizontal.svg)

</div>

### Perbandingan Kedua Pendekatan

| Parameter | Vertical Scaling (Scale Up) | Horizontal Scaling (Scale Out) |
| :--- | :--- | :--- |
| **Konsep** | Memperbesar kapasitas satu mesin (menaikkan RAM, CPU, SSD). | Menambah jumlah mesin yang berjalan secara paralel. |
| **Perubahan Kode** | Hampir tidak ada. Kode lama langsung jalan di mesin baru. | Aplikasi backend harus bersifat *stateless*. |
| **Batas Maksimal** | Terbatas oleh limit fisik spesifikasi hardware tertinggi di pasaran. | Praktis tidak terbatas, bisa terus menambah node baru. |
| **Toleransi Kerusakan** | Nol. Jika mesin raksasa tersebut crash, sistem tetap mati. | Tinggi (*High Availability*). Satu mesin mati, mesin lain mengambil alih. |
| **Downtime** | Biasanya butuh *reboot* saat resize spesifikasi. | *Zero downtime* saat menambah atau mengurangi node. |
| **Biaya** | Sangat mahal secara eksponensial di spek monster. | Lebih efisien karena memakai kombinasi mesin komoditas standar. |

---

## Langkah Pertama: Memisahkan Server Web dan Database

Langkah awal sebelum melompat ke arsitektur rumit adalah memisahkan tanggung jawab:
1. **Server Aplikasi (Compute)**: Khusus mengeksekusi kode backend (Node.js/Laravel/Go) dan melayani request HTTP.
2. **Server Database (Storage)**: Khusus mengelola data di instance terpisah dengan alokasi disk dan RAM yang terlindung.

Dengan memisahkan keduanya, jika aplikasi web mengalami lonjakan CPU atau memory leak, proses database tetap aman dan tidak ikut korup.

---

## Latihan Mandiri (Hands-on)

Ambil satu proyek backend terakhir yang pernah kamu buat (misalnya proyek CRUD absensi, e-commerce sederhana, atau blog API), lalu lakukan analisis berikut:

1. Buka [Excalidraw](https://excalidraw.com) atau selembar kertas.
2. Gambar kotak-kotak komponen sistemmu saat ini.
3. Identifikasi:
   - Di mana titik *Single Point of Failure (SPOF)* pada sistemmu?
   - Apa yang terjadi jika ada 10.000 user melakukan request bersamaan ke endpoint pencarian data (*search*)? Bagian mana yang akan roboh lebih dulu?
   - Apakah aplikasi backend-mu saat ini menyimpan session user di memori lokal server, atau sudah siap jika dijalankan di 3 server berbeda?

Pada pertemuan selanjutnya, kita akan membedah **Core Building Blocks** yang digunakan industri untuk menghubungkan server-server tersebut menjadi arsitektur yang tahan banting.

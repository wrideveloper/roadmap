# Core Building Blocks dan Skalabilitas Arsitektur

Pada pertemuan sebelumnya, kita sudah menyepakati bahwa strategi paling ideal untuk mencapai *High Availability* adalah **Horizontal Scaling** (menjalankan aplikasi di banyak mesin paralel).

Namun, menambah banyak server memunculkan pertanyaan teknis baru:
- Siapa yang bertugas membagi traffic pengguna agar tidak menumpuk di satu server saja?
- Bagaimana mencegah database jebol saat ribuan user membaca data yang sama berulang-ulang?
- Bagaimana memastikan user tidak menunggu 5 detik hanya untuk checkout tiket?

Di pertemuan ini, kita akan membedah **enam komponen dasar (*building blocks*)** yang menjadi tulang punggung arsitektur backend modern.

---

## 1. Reverse Proxy dan Load Balancer

Ketika kamu memiliki tiga server backend yang berjalan bersamaan, browser user tidak boleh tahu IP address masing-masing server tersebut. Di sinilah peran **Reverse Proxy** dan **Load Balancer** (seperti Nginx, HAProxy, atau AWS Application Load Balancer).

<div align="center">

![Reverse Proxy and Load Balancer Flow](/miniclass/backend/assets/system-design/04-load-balancer-flow.svg)

</div>

### Tugas Utama Load Balancer
1. **Penyalur Beban (Traffic Distribution)**: Membagi request yang masuk menggunakan algoritma tertentu, misalnya:
   - **Round Robin**: Request 1 ke Server A, Request 2 ke Server B, Request 3 ke Server C, lalu berputar kembali.
   - **Least Connections**: Request selalu dikirim ke server yang saat itu sedang menangani koneksi paling sedikit.
   - **IP Hashing**: Request dari user dengan IP yang sama akan selalu diarahkan ke server yang sama.
2. **Health Check**: Secara berkala memeriksa apakah server-server di belakangnya masih sehat. Jika Server B mendadak mati, Load Balancer akan langsung mencoret Server B dan hanya mengirim traffic ke Server A dan C.
3. **SSL / TLS Termination**: Enkripsi HTTPS didekripsi di level Load Balancer, sehingga server aplikasi di belakangnya bisa fokus memproses data tanpa terbebani enkripsi/dekripsi berulang.

> **Syarat Wajib:** Agar bisa dipasangi Load Balancer, aplikasi backend-mu harus bersifat **Stateless**. Artinya, jangan menyimpan session login di memori internal server (misal di folder lokal server). Simpan session di tempat terpusat seperti Redis atau gunakan token JWT.

---

## 2. Caching Strategy dengan Redis

Database relasional (seperti MySQL atau PostgreSQL) menyimpan datanya di penyimpanan disk (SSD/HDD). Membaca data dari disk melibatkan operasi I/O yang relatif lambat (memakan waktu puluhan hingga ratusan milidetik per query).

Jika ada 10.000 user membuka halaman beranda yang menampilkan daftar kategori produk yang sama persis, mengapa kita harus membebani database dengan 10.000 query `SELECT` yang identik?

Solusinya adalah **In-Memory Caching** menggunakan **Redis**.

<div align="center">

![Caching Flow with Redis](/miniclass/backend/assets/system-design/05-caching-redis-flow.svg)

</div>

### Pola Kerja: Cache-Aside Pattern
1. Saat request datang, aplikasi memeriksa terlebih dahulu apakah datanya ada di Redis.
2. **Cache Hit**: Jika data ditemukan di Redis, langsung kembalikan ke user dalam waktu 1-2 ms. Database sama sekali tidak tersentuh.
3. **Cache Miss**: Jika data belum ada di Redis, aplikasi akan menjalankan query ke database, menyalin hasilnya ke Redis dengan masa kedaluwarsa (*TTL - Time To Live*), lalu mengirimkannya ke user.

::: tip Catatan Praktik
Selalu tetapkan batas waktu kedaluwarsa (**TTL**) pada setiap key cache (misal: 15 menit atau 1 jam). Jika data master di database berubah, aplikasi harus menghapus (*invalidate*) key cache terkait agar user tidak melihat data basi (*stale data*).
:::

---

## 3. Database Replication: Read / Write Split

Pada sebagian besar aplikasi web (seperti e-commerce, media sosial, atau portal berita), pola traffic-nya bersifat **Read-Heavy**: sekitar 80% hingga 95% operasi adalah membaca data (`SELECT`), sedangkan operasi menulis (`INSERT`, `UPDATE`, `DELETE`) hanya berkisar 5% hingga 20%.

Jika satu server database harus melayani operasi baca dan tulis sekaligus di bawah traffic tinggi, database akan mengalami bottleneck pada *connection pool* dan *disk I/O*.

<div align="center">

![Database Replication Read Write Split](/miniclass/backend/assets/system-design/06-database-replication.svg)

</div>

### Mekanisme Primary-Replica
- **Primary Database (Master)**: Satu server khusus yang bertugas mengeksekusi semua operasi **Write**.
- **Read Replicas (Slaves)**: Satu atau beberapa server database turunan yang terus menyinkronkan data secara asinkron dari Primary. Server ini khusus melayani operasi **Read**.
- **Hasil**: Ketika jutaan user sedang membaca halaman, beban query terbagi merata di deretan Replicas, sementara Primary DB tetap leluasa menerima data baru.

---

## 4. Asynchronous Processing dan Message Queue

Pernahkah kamu memesan tiket atau checkout barang, lalu halaman web berputar loading sampai 5 detik lebih? 

Hal tersebut sering terjadi karena backend memproses semua pekerjaan berat secara **Synchronous** (berurutan dalam satu siklus request-response HTTP):

<div align="center">

![Message Queue Flow](/miniclass/backend/assets/system-design/07-message-queue-flow.svg)

</div>

### Solusi: Message Queue (RabbitMQ / Redis Queue)
Pekerjaan berat yang tidak perlu ditunggu hasilnya oleh user harus dipindahkan ke **Background Worker** menggunakan antrean (*Message Queue*):
1. User mengklik tombol "Bayar".
2. Server mencatat transaksi ke database (200 ms).
3. Server melempar pesan job ke Message Queue (*"Kirim email invoice ke user X"*).
4. Server langsung mengembalikan respon `200 OK: Pembayaran Berhasil!` ke user.
5. Di balik layar, proses worker yang berdiri sendiri mengambil job tersebut dari antrean untuk merender PDF dan mengirim email via SMTP secara santai.

Jika server email pihak ketiga sedang lambat atau mengalami gangguan, user tidak terkena dampaknya, dan worker bisa mencoba ulang (*retry*) job tersebut secara otomatis.

---

## 5. Rate Limiting

Bagaimana jika ada satu user atau bot nakal yang menjalankan script dan memborbardir endpoint `/api/login` sebanyak 500 kali per detik? Tanpa pembatasan, resource server dan koneksi database akan habis terserap oleh satu user tersebut.

**Rate Limiting** bertugas membatasi jumlah request yang boleh dilakukan oleh satu identitas (berdasarkan IP address, API key, atau User ID) dalam jendela waktu tertentu.

- Contoh aturan: *Maksimal 60 request per menit per alamat IP*.
- Jika batas kuota terlampaui, server langsung menolak request berikutnya dengan status code **`429 Too Many Requests`** sebelum request tersebut menyentuh logika bisnis atau database.

---

## 6. Monolith vs Microservices: Kapan Kita Membutuhkannya?

Banyak developer pemula yang beranggapan bahwa arsitektur modern wajib menggunakan **Microservices**. Pandangan ini keliru dan sering kali menjadi jebakan *over-engineering*.

| Parameter | Monolith (Modular Monolith) | Microservices |
| :--- | :--- | :--- |
| **Kompleksitas Deploy** | Sangat mudah: 1 repositori, 1 pipeline CI/CD. | Kompleks: butuh orkestrasi container (Kubernetes/Docker Swarm). |
| **Komunikasi Data** | Pemanggilan fungsi internal memori (sangat cepat, 0 ms). | Komunikasi via jaringan (HTTP/gRPC), rawan kegagalan jaringan (*network latency*). |
| **Debugging & Tracing** | Mudah mencari bug dari log aplikasi tunggal. | Butuh *Distributed Tracing* (Jaeger/OpenTelemetry) untuk melacak alur request. |
| **Kapan Dipakai?** | **Rekomendasi utama** untuk tahap awal, startup, tim kecil hingga menengah. | Hanya jika ukuran tim rekayasa sudah besar (puluhan engineer) dan butuh rilis kode independen. |

::: warning Prinsip Arsitektur
Monolit yang dirancang secara modular dan di-scale secara horizontal jauh lebih stabil dan hemat biaya dibanding microservices yang dipaksakan pada tim kecil.
:::

---

## Gambaran Besar: Arsitektur Backend yang Skalabel

Ketika semua *building blocks* di atas digabungkan, berikut adalah anatomi lengkap arsitektur backend modern yang siap menampung beban skala besar:

<div align="center">

![Full Scalable Architecture Overview](/miniclass/backend/assets/system-design/08-full-architecture-overview.svg)

</div>

Alur request pengguna:
1. **Edge / CDN**: User mengakses domain, request statis diselesaikan di CDN, sementara traffic mencurigakan disaring oleh Rate Limiter.
2. **Load Balancer**: Mengarahkan request dinamis ke salah satu node App Server yang sehat.
3. **App Server (Stateless)**: Menjalankan logika bisnis. Pertama memeriksa ketersediaan data di Redis Cache.
4. **Database Cluster**: Jika cache miss, data diambil dari Read Replica. Operasi penulisan diarahkan ke Primary DB.
5. **Message Queue & Workers**: Tugas berat dilempar ke antrean untuk diselesaikan di latar belakang.

---

## Studi Kasus Praktik: Sistem PEMIRA Multi-Tenant (Pemilihan Raya Kampus)

Sebagai penutup modul Advance Backend ini, ujilah pemahaman arsitekturmu dengan menyelesaikan studi kasus nyata yang sangat relevan di lingkungan kampus: **Sistem Pemilihan Raya (PEMIRA)**.

### Deskripsi Masalah
Kampus menyelenggarakan PEMIRA serentak untuk memilih pimpinan organisasi mahasiswa. Sistem ini bersifat **Multi-Tenant** karena digunakan bersama oleh berbagai entitas organisasi kampus dengan cakupan hak pilih yang berbeda:
1. **Tenant Kampus (Global)**: Pemilihan Presiden BEM dan perwakilan DPM. Pemilihan ini bisa diikuti oleh **seluruh mahasiswa aktif lintas jurusan** (sekitar 15.000 mahasiswa).
2. **Tenant Jurusan (Spesifik)**: Pemilihan Ketua Himpunan Mahasiswa Jurusan (HMJ) seperti HMTI (Teknologi Informasi), HMM (Mesin), atau HME (Elektro). Kategori ini **hanya boleh diakses dan dipilih oleh mahasiswa dari jurusan terkait**.

Sistem dibuka serentak dari pukul 08.00 sampai 15.00, dengan lonjakan traffic paling padat di jam istirahat kuliah (pukul 12.00).

---

### Tantangan Arsitektur yang Harus Diselesaikan

#### 1. Multi-Tenancy dan Isolasi Hak Pilih
- Bagaimana memodelkan data ballot dan kandidat antara BEM (lingkup kampus) dan HMJ (lingkup jurusan)?
- Bagaimana mencegah celah manipulasi: memastikan mahasiswa Jurusan Mesin tidak bisa "menembak" API secara langsung untuk memilih kandidat HMJ Teknologi Informasi?

#### 2. Integritas Suara dan Pencegahan Vote Ganda (Zero Double-Voting)
- Satu mahasiswa hanya memiliki hak **1 kali vote per kategori** (1 suara BEM, 1 suara DPM, dan 1 suara HMJ jurusannya).
- Mencegah *race condition*: apa yang terjadi jika user sengaja membuka dua tab browser dan menekan tombol "Submit Vote" di milidetik yang sama persis? Bagaimana memanfaatkan kombinasi *Database Unique Constraint* dan *Redis Lock / Idempotency Key* di sini?

#### 3. Lonjakan Penulisan Suara (Write Spike)
- Di jam istirahat, ribuan mahasiswa melakukan submit suara secara serentak.
- Menulis langsung ke database relasional dengan transaksi berat berisiko mengunci tabel (*table lock / connection pool exhausted*). Bagaimana peran *Message Queue* sebagai penyangga (*buffer*) agar server web langsung merespon "Suara Diterima" tanpa membebani database utama?

#### 4. Live Quick Count / Leaderboard (Read Spike)
- Panitia pemilihan dan ribuan mahasiswa memantau perolehan suara secara berkala.
- Menjalankan query agregasi berat (`SELECT candidate_id, COUNT(*) FROM votes GROUP BY candidate_id`) berulang-ulang ke database utama akan melumpuhkan server. Bagaimana peran Redis Cache untuk menyajikan angka perolehan suara secara instan?

---

### Tugas Desain Mandiri

Gunakan alat visual seperti [Excalidraw](https://excalidraw.com) untuk merancang arsitektur sistem PEMIRA di atas:
1. **Gambarkan Diagram Arsitektur Lengkap**:
   - Tentukan letak CDN/Rate Limiter, Load Balancer, Cluster App Server Stateless, Redis Cache & Queue, serta Database (Primary & Replica).
2. **Tuliskan Ringkasan Solusi Teknis**:
   - Jelaskan bagaimana kamu mengatur isolasi tenant antara BEM dan HMJ.
   - Jelaskan strategi penanganan lonjakan penulisan suara saat jam sibuk.
   - Jelaskan bagaimana Live Quick Count disajikan tanpa membebani database utama.

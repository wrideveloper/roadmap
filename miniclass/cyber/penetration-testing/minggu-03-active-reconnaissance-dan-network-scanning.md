# Minggu 3: Active Reconnaissance & Network Scanning

Minggu ini kita mulai "menyentuh" target secara langsung. Fokus utama kita bukan sekadar menjalankan perintah scan sebanyak mungkin, melainkan memahami **mengapa** scan dilakukan, bagaimana **menginterpretasikan** output, dan bagaimana **memilih** service mana yang paling menjanjikan untuk diserang.

---

## Tujuan Pembelajaran

Di akhir minggu ini, kamu diharapkan mampu:
- [ ] Memahami perbedaan filosofis antara **Host Discovery** dan **Port Scanning**.
- [ ] Menguasai teknik **Nmap** (Quick scan vs Detailed scan).
- [ ] Mengidentifikasi servis dan versi aplikasi yang berjalan.
- [ ] Menyusun hipotesis awal berdasarkan hasil scanning.

---

## Konsep Dasar: Menemukan Pintu Masuk

Sebelum mulai mengetik perintah, mari kita samakan persepsi tentang tiga pilar utama aktivitas minggu ini:

1.  **Host Discovery**: Mencari tahu siapa saja yang "aktif" di dalam sebuah subnet.
2.  **Port Scanning**: Mengetuk setiap pintu di rumah target untuk melihat mana yang tidak terkunci.
3.  **Service Detection**: Mengintip lewat lubang kunci untuk mengetahui apa yang ada di balik pintu tersebut (web server? database? file sharing?).

> [!TIP]
> Port terbuka tidak selalu berarti ada celah keamanan. Port terbuka hanyalah sebuah indikator keberadaan suatu layanan yang butuh investigasi lebih lanjut.

---

## Cara Kerja: Di Balik Layar Port Scanning

Nmap tidak melakukan sihir; ia menggunakan protokol jaringan standar untuk mendapatkan informasi. Cara Nmap mengirim paket menentukan seberapa akurat dan seberapa terdeteksi aktivitas scan tersebut.

### TCP Three-Way Handshake
Hampir semua komunikasi di internet menggunakan protokol TCP. Sebelum data dikirim, terjadi proses yang disebut **Three-Way Handshake**:

```text
Attacker                          Target
   |                                 |
   |  ── SYN ──────────────────────► |   ① "Halo, port 80 buka?"
   |  ◄────────────────── SYN-ACK ── |   ② "Halo! Iya buka, ayo konek."
   |  ── ACK ──────────────────────► |   ③ "Oke, sip! Kita mulai ya."
   |                                 |
   |  [Koneksi Terbentuk]            |
```

Respons target berdasarkan status port:
- **Port Terbuka**: Target membalas dengan `SYN-ACK`.
- **Port Tertutup**: Target membalas dengan `RST` (Reset).
- **Port Difilter**: Tidak ada balasan (paket dibuang oleh firewall).

### UDP: Si Cepat yang Pendiam
Berbeda dengan TCP, UDP adalah protokol "tembak dan lupakan" tanpa mekanisme handshake.
```text
Port UDP Terbuka  :  Paket ──► [Respons UDP]
Port UDP Tertutup :  Paket ──► ICMP "Port Unreachable"
Tidak Pasti       :  Paket ──► [Tidak ada respons] → Label: open|filtered
```
> [!NOTE]
> Ketiadaan handshake membuat scanning UDP jauh lebih lambat karena Nmap harus menunggu *timeout* sebelum menyimpulkan status port.

---

## Teknik Utama Scanning Nmap

Pilih senjatamu sesuai dengan kondisi lapangan dan hak akses yang kamu miliki:

| Teknik | Flag | Akses Root? | Kecepatan | Deteksi IDS | Kegunaan Utama |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **SYN Scan** | `-sS` | **Ya** | Sangat Cepat | Sedang | Default & Efisien (Stealth) |
| **TCP Connect** | `-sT` | Tidak | Sedang | Tinggi | Digunakan jika tidak punya root |
| **UDP Scan** | `-sU` | **Ya** | Lambat | Rendah | Mencari DNS, SNMP, atau DHCP |

---

### Detail Teknik

#### `-sS` — SYN Scan (Stealth Scan)
Ini adalah "pedang" utama penetration tester. Nmap memulai handshake tapi segera mengirim `RST` setelah menerima `SYN-ACK`, sehingga koneksi tidak pernah benar-benar terbentuk.
> [!IMPORTANT]
> Karena koneksi tidak selesai, banyak sistem logging lama tidak mencatat aktivitas ini. Namun, firewall modern tetap bisa mendeteksinya.

#### `-sT` — TCP Connect Scan
Nmap meminta OS untuk menyelesaikan seluruh proses handshake. Ini lebih lambat dan "berisik" di log target, tapi tidak membutuhkan akses root untuk dijalankan.

#### `-sU` — UDP Scan
[gambar screenshot output nmap menunjukkan port udp yang open|filtered]
Selalu luangkan waktu untuk scan UDP pada port populer. Banyak celah keamanan fatal ditemukan di layanan UDP yang sering terlupakan (seperti SNMP atau DNS).

---

## Cheat Sheet: Perintah Wajib Nmap

Gunakan perintah berikut sebagai urutan standar di lingkungan Lab:

```bash
# 1. Host Discovery (Cari target yang aktif di subnet)
nmap -sn 192.168.56.0/24

# 2. Scanning Dasar (Cek 1000 port paling umum - SYN Scan)
sudo nmap -sS 192.168.56.101

# 3. Scanning Detail (Versi Service & Default Script)
sudo nmap -sS -sV -sC 192.168.56.101

# 4. Scanning Seluruh Port (0-65535) - Penting!
sudo nmap -p- 192.168.56.101

# 5. UDP Scanning pada 20 port paling populer
sudo nmap -sU --top-ports 20 192.168.56.101
```

### Referensi Flag Nmap Lengkap

| Kategori | Flag | Deskripsi |
| :--- | :--- | :--- |
| **Host Discovery** | `-sn` | Ping Scan - Menonaktifkan port scan (hanya cari host aktif). |
| | `-Pn` | Lewati host discovery - Anggap semua host aktif (lewati blokir ping). |
| **Teknik Scan** | `-sS` | TCP SYN Scan (Stealth) - Cepat, butuh akses root. |
| | `-sT` | TCP Connect Scan - Default tanpa root, lebih lambat. |
| | `-sU` | UDP Scan - Mencari layanan UDP aktif. |
| **Opsi Port** | `-p <n>` | Scan port tertentu (contoh: `-p 22,80,443`). |
| | `-p-` | Scan seluruh 65.535 port. |
| | `--top-ports <n>` | Scan `<n>` jumlah port paling populer. |
| **Deteksi** | `-sV` | Deteksi Versi - Mencoba menebak versi service aplikasi. |
| | `-sC` | Script Scan - Menjalankan default scripts Nmap (NSE). |
| | `-O` | OS Detection - Mencoba menebak Sistem Operasi target. |
| | `-A` | Aggressive Scan - Gabungan dari `-sV`, `-sC`, `-O`, dan traceroute. |
| **Performa** | `-T<0-5>` | Mengatur kecepatan (0: sangat lambat, 5: sangat agresif). T4 disarankan. |
| **Output** | `-oN <file>` | Simpan hasil dalam format teks normal. |
| | `-oX <file>` | Simpan hasil dalam format XML. |
| | `-oG <file>` | Simpan hasil dalam format yang mudah di-*grep*. |


---

## Referensi Praktikum: TryHackMe

Selesaikan modul berikut untuk memperkuat pemahaman sebelum masuk ke Lab internal:

### [Nmap: The Basics](https://tryhackme.com/room/nmap01) (Wajib)
**Estimasi:** 1–2 jam | **Fokus:** Host discovery, TCP/SYN Scan, dan membaca output.
> Perhatikan kolom `SERVICE` dan `VERSION`. Informasi ini adalah kunci untuk fase eksploitasi nanti.

### [Further Nmap](https://tryhackme.com/room/furthernmap) (Pengayaan)
**Estimasi:** 1–2 jam | **Fokus:** NSE (Nmap Scripting Engine) dan deteksi sistem operasi.

---

## Kesalahan Umum (Hati-hati!)

- **Scanning Tanpa Tujuan**: Menjalankan `-p-` tanpa melakukan *host discovery* terlebih dahulu. Ini membuang waktu secara tidak efisien.
- **Lupa Scan UDP**: Terlalu fokus pada TCP dan melewati layanan rentan di UDP.
- **Mengabaikan Versi**: Melihat port terbuka tapi tidak mencatat versinya. Versi yang tepat memudahkan kamu mencari exploit di database seperti Exploit-DB.
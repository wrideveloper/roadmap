# Chapter 2: Passive Reconnaissance & OSINT

## 1. Pendahuluan

Passive Reconnaissance (Passive Recon) adalah proses pengumpulan informasi tentang target **tanpa melakukan interaksi langsung dengan sistem target**.

Seluruh data yang digunakan berasal dari:

- Sumber publik (publicly available data)
- Arsip digital
- Metadata
- Infrastruktur terbuka (DNS, WHOIS, dll)
- Basis data domain, DNS, dan sertifikat digital
- Informasi organisasi dan teknologi yang dipublikasikan

Fokus utama bukan pada jumlah data, tetapi pada **kualitas informasi, validitas bukti, dan konteks** yang dapat digunakan untuk memahami attack surface dan menyusun hipotesis pada tahap selanjutnya.

OSINT (Open-Source Intelligence) merupakan pendekatan yang lebih luas, meliputi pengumpulan, verifikasi, analisis, dan interpretasi informasi dari sumber terbuka. Passive reconnaissance dapat menggunakan teknik OSINT, tetapi keduanya tidak sepenuhnya identik.

Sebagian aset organisasi sering luput dari inventaris: subdomain staging lama, server uji yang tidak lagi dipakai, DNS record basi, atau dokumen publik yang masih menyimpan metadata. Passive recon membantu menemukan jejak tersebut sebelum dipakai penyerang.

> Catatan: Passive reconnaissance tidak selalu berarti anonim atau tanpa jejak. Aktivitas pencarian melalui layanan pihak ketiga tetap dapat tercatat oleh layanan tersebut.

---

## 2. Passive vs Active Reconnaissance

| Aspek                   | Passive Recon                                        | Active Recon           |
| ----------------------- | ---------------------------------------------------- | ---------------------- |
| Interaksi dengan target | Tidak berinteraksi langsung dengan target            | Ada                    |
| Sumber data             | Informasi publik, arsip, dan basis data pihak ketiga | Respons sistem target  |
| Tujuan                  | Membangun konteks dan hipotesis                      | Validasi teknis        |
| Risiko deteksi          | Sangat rendah                                        | Lebih tinggi           |
| Contoh                  | OSINT, metadata, Google dork                         | Port scanning, fuzzing |

> Passive recon selalu dilakukan terlebih dahulu sebelum active recon.

---

## 3. Tujuan Passive Recon

Passive recon bertujuan untuk:

- Mengidentifikasi teknologi yang digunakan target
- Mengidentifikasi domain, subdomain historis, dan aset digital yang terindikasi berkaitan dengan target
- Memahami struktur organisasi & sistem
- Mengurangi blind testing saat active recon

Tanpa tahap ini, pengujian akan bersifat acak dan tidak efisien.

---

## 4. Konsep Confidence Level

Setiap temuan harus memiliki tingkat keyakinan yang menggambarkan kekuatan bukti dan kepastian interpretasi.

| Label         | Definisi                                 |
| ------------- | ---------------------------------------- |
| **Confirmed** | Didukung bukti langsung                  |
| **Likely**    | Indikasi kuat namun belum pasti          |
| **Unknown**   | Informasi belum cukup untuk menyimpulkan |

**Prinsip penting:** Jangan pernah menulis asumsi sebagai fakta. Bedakan apa yang benar-benar diamati dengan interpretasi atas observasi tersebut.

Contoh:

- ❌ "Target menggunakan WordPress"
- ✅ "Target kemungkinan menggunakan WordPress (indikasi: wp-content)"

Contoh lainnya:

- **Observasi:** dev.example.com tercatat pada Certificate Transparency.
- **Kesimpulan:** Nama host tersebut tercatat dalam sumber Certificate Transparency.
- **Status:** Belum diketahui apakah host masih aktif atau masih digunakan oleh organisasi.

---

## 5. Format Catatan Recon

Gunakan format berikut untuk menjaga konsistensi:

| Field                | Deskripsi            |
| -------------------- | -------------------- |
| Target Name          | Nama organisasi      |
| Known Domains        | Domain terverifikasi |
| Suspected Subdomains | Subdomain dugaan     |
| Technology Clues     | Indikasi teknologi   |
| Email Pattern        | Pola email           |
| Source               | Sumber informasi     |
| Confidence           | Tingkat keyakinan    |

---

## 6. Workflow Passive Recon

> ⚠️ Seluruh aktivitas dalam bagian ini dibatasi pada pengumpulan informasi melalui sumber publik, arsip, dan layanan pihak ketiga. Jangan mengirim request langsung ke infrastruktur target sebagai bagian dari passive recon.

---

### 6.1 Target Definition

**Tujuan:** Menentukan scope sebelum memulai.

Catat:

- Nama target
- Domain utama
- Bidang organisasi

---

### 6.2 Website Recon (Manual Inspection)

**Tools:** Browser (Chrome, Firefox, dll)

**Teknik:**

- Observasi halaman utama
- Periksa footer
- Navigasi semua menu yang tersedia

**Output:**

- Known domains
- Endpoint penting (login, dashboard)
- Struktur URL

---

### 6.3 Technology Fingerprinting

**Tools:** Wappalyzer (extension)

**Yang dicari:**

- CMS (WordPress, Drupal)
- Framework (React, Vue)
- Web server (Nginx, Apache)

**Analisis:**

- Versi teknologi jika terlihat
- Indikasi stack backend

---

### 6.4 Source Code Analysis

**Tools:** Browser DevTools, View Source (`Ctrl+U`)

**Yang dianalisis:**

- Meta tags (`generator`)
- Komentar HTML
- Path file (`/wp-content/`, `/static/`)
- Script JS yang dimuat

**Output:**

- Indikasi framework
- Struktur aplikasi

---

### 6.5 Google Dorking

**Tools:** Google Search

**Query umum:**

```text
site:target.com
site:target.com login
site:target.com admin
site:target.com filetype:pdf
```

Ganti target.com dengan domain lab atau domain yang telah disetujui.

**Output:**

- Halaman tersembunyi
- Dokumen publik
- Referensi endpoint yang terlihat pada hasil pencarian
- Endpoint lama yang masih terindeks

---

### 6.6 Subdomain Enumeration (Passive)

**Tools:** crt.sh, VirusTotal, DNSDumpster, Amass (passive mode)

**Command (Amass passive):**

```text
amass enum -passive -d example.com
```

Mode passive menggabungkan beberapa sumber publik tanpa melakukan brute force. Detail mode aktif dan opsi lanjutan dibahas pada week 4.

**Output:**

- Daftar subdomain historis
- Waktu atau konteks data jika tersedia
- Confidence level dan catatan status verifikasi

**Catatan:**

- Subdomain yang ditemukan belum tentu masih aktif
- Nama host yang mirip belum tentu dimiliki oleh target
- Beri label Likely hanya jika bukti mendukung keterkaitannya, jika belum cukup gunakan Unknown.

---

### 6.7 DNS & WHOIS Analysis

**Tools:** whois lookup, dig, DNSDumpster

**Yang dicari:**

- MX record (email provider)
- TXT record (verifikasi layanan)
- IP / CDN yang digunakan

**Insight:**

- Infrastruktur cloud
- Layanan pihak ketiga

---

### 6.8 Pencarian Layanan Terekspos (Shodan & Censys)

**Tools:** Shodan, Censys

Shodan dan Censys adalah mesin pencari untuk perangkat dan layanan yang terhubung ke internet. Keduanya menampilkan data hasil pemindaian pihak ketiga, bukan hasil request langsung ke target.

**Yang dicari:**

- Port dan service yang terbuka
- Nama host, organisasi, dan sertifikat TLS
- Teknologi atau versi service yang terdeteksi
- Panel administrasi atau perangkat yang tidak seharusnya publik

**Contoh query Shodan:**

```text
hostname:example.com
org:"Example Inc"
ssl:"example.com"
```

Censys menyediakan fungsi serupa dengan filter dan data yang sedikit berbeda. Gunakan sebagai pembanding, bukan bukti tunggal.

**Catatan:**

- Data dapat basi, tidak lengkap, atau berasal dari host yang sudah berganti pemilik
- Exposure belum berarti vulnerable; validasi dilakukan pada active recon
- Jangan mengakses panel atau service yang ditemukan hanya karena terlihat publik

---

### 6.9 Document Metadata Extraction

**Tools:** ExifTool, FOCA

**Command:**

```text
exiftool file.pdf
```

**Metadata yang dapat diperiksa:**

- Nama aplikasi pembuat dokumen
- Waktu pembuatan atau modifikasi
- Nama author jika tersedia
- Informasi perangkat lunak yang digunakan
- Properti dan metadata dokumen lainnya

**Output:**

- Username internal
- Software yang digunakan
- File path tersembunyi

---

### 6.10 OSINT: People & Organization

**Tools:** theHarvester, LinkedIn, Twitter/X, halaman karier website target

**Yang dicari:**

- Tech stack dari job posting
- Struktur tim
- Nama karyawan
- Email dan username yang dipublikasikan

**Command (theHarvester, opsional):**

```text
theHarvester -d example.com -b bing,duckduckgo,crtsh -l 100
```

Sumber dan hasil bergantung pada API key serta kebijakan tiap layanan. Kumpulkan hanya informasi yang relevan dengan scope pengujian.

---

### 6.11 Email Pattern Analysis

**Sumber:** Kontak publik, metadata dokumen, hasil theHarvester

**Contoh pola:**

- `firstname.lastname@domain.com`
- `firstinitial.lastname@domain.com`

---

## 7. Penyusunan Data Recon

Contoh tabel hasil recon:

| Field     | Data              | Source        | Confidence |
| --------- | ----------------- | ------------- | ---------- |
| Domain    | example.com       | Website resmi | Confirmed  |
| Subdomain | dev.example.com   | crt.sh        | Likely     |
| Teknologi | WordPress         | HTML source   | Likely     |
| Layanan   | 203.0.113.10:8443 | Shodan        | Likely     |

---

## 8. Penyusunan Hipotesis

Hipotesis yang baik harus:

1. Berdasarkan bukti yang ditemukan
2. Spesifik dan tidak ambigu
3. Memiliki confidence level yang sesuai
4. Bisa diverifikasi di fase active recon

**Format:**

```text
Hipotesis  : [pernyataan dugaan yang spesifik]
Dasar      : [informasi apa yang ditemukan dan dari mana]
Confidence : [Confirmed / Likely / Unknown]
Verifikasi : [cara membuktikannya saat active recon]
```

**Contoh:**

```text
Hipotesis  : Target kemungkinan menggunakan WordPress
Dasar      : Ditemukan path /wp-content/ di HTML source
Confidence : Likely
Verifikasi : Cek endpoint WordPress saat active recon
```

```text
Hipotesis  : Terdapat admin panel di subdomain admin.target.com
Dasar      : Ada referensi "dashboard" di halaman About
Confidence : Likely
Verifikasi : Akses subdomain saat active recon
```

---

## 9. Deliverables

Setiap peserta wajib menghasilkan:

1. **Tabel recon lengkap** — memuat data, source, dan confidence untuk setiap temuan
2. **Minimal 3 hipotesis** — jelas, logis, dan bisa diverifikasi

---

## 10. Kesalahan Umum

- Over-collecting tanpa analisis yang memadai
- Tidak mencatat sumber temuan
- Menganggap dugaan sebagai fakta
- Menganggap semua subdomain yang ditemukan masih aktif
- Tidak memberi confidence label
- Single-source conclusion — tidak melakukan triangulasi dari beberapa sumber
- Mencampurkan passive reconnaissance dengan direct web inspection atau active enumeration
- Menganggap temuan Shodan atau Censys sebagai bukti langsung tanpa validasi
- Mengumpulkan informasi pribadi yang tidak relevan dengan tujuan pengujian

---

## 11. Prinsip Penting

**Passive Recon = Observasi, bukan interaksi.**

Aktivitas berikut termasuk active recon dan tidak dilakukan pada tahap ini:

- Port scanning
- Request langsung ke server
- Brute force
- Directory fuzzing

---

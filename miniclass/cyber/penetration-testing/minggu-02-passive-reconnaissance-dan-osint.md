# Minggu 2: Passive Reconnaissance & OSINT

## 1. Pendahuluan

Passive Reconnaissance (Passive Recon) adalah proses pengumpulan informasi tentang target **tanpa melakukan interaksi langsung dengan sistem target**.

Seluruh data yang digunakan berasal dari:

- Sumber publik (publicly available data)
- Arsip digital
- Metadata
- Infrastruktur terbuka (DNS, WHOIS, dll)

Fokus utama bukan pada jumlah data, tetapi pada **kualitas informasi dan konteks** yang dapat digunakan untuk tahap selanjutnya.

---

## 2. Passive vs Active Reconnaissance

| Aspek | Passive Recon | Active Recon |
| --- | --- | --- |
| Interaksi dengan target | Tidak ada | Ada |
| Sumber data | Informasi publik | Response sistem target |
| Tujuan | Membangun konteks & hipotesis | Validasi teknis |
| Risiko deteksi | Sangat rendah | Lebih tinggi |
| Contoh | OSINT, metadata, Google dork | Port scanning, fuzzing |

> Passive recon selalu dilakukan terlebih dahulu sebelum active recon.

---

## 3. Tujuan Passive Recon

Passive recon bertujuan untuk:

- Mengidentifikasi teknologi yang digunakan target
- Menemukan attack surface (subdomain, endpoint, portal)
- Memahami struktur organisasi & sistem
- Mengurangi blind testing saat active recon

Tanpa tahap ini, pengujian akan bersifat acak dan tidak efisien.

---

## 4. Konsep Confidence Level

Setiap temuan harus memiliki tingkat keyakinan.

| Label | Definisi |
| --- | --- |
| **Confirmed** | Didukung bukti langsung |
| **Likely** | Indikasi kuat namun belum pasti |
| **Unknown** | Tidak cukup informasi |

**Prinsip penting:** Jangan pernah menulis asumsi sebagai fakta.

Contoh:

- ❌ "Target menggunakan WordPress"
- ✅ "Target kemungkinan menggunakan WordPress (indikasi: wp-content)"

---

## 5. Format Catatan Recon

Gunakan format berikut untuk menjaga konsistensi:

| Field | Deskripsi |
| --- | --- |
| Target Name | Nama organisasi |
| Known Domains | Domain terverifikasi |
| Suspected Subdomains | Subdomain dugaan |
| Technology Clues | Indikasi teknologi |
| Email Pattern | Pola email |
| Source | Sumber informasi |
| Confidence | Tingkat keyakinan |

---

## 6. Workflow Passive Recon

> ⚠️ Semua aktivitas harus pasif — tidak ada request langsung ke server target.

---

### 6.1 Target Definition

**Tujuan:** Menentukan scope sebelum memulai.

Catat:

- Nama target
- Domain utama
- Bidang organisasi

---

### 6.2 Website Recon (Manual Inspection)

**Tools:** Browser (Chrome / Firefox)

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

**Tools:** Wappalyzer (extension), BuiltWith

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

```
site:target.com
site:target.com login
site:target.com admin
site:target.com filetype:pdf
cache:target.com
```

**Output:**

- Halaman tersembunyi
- Dokumen publik
- Endpoint lama yang masih terindeks

---

### 6.6 Subdomain Enumeration (Passive)

**Tools:** crt.sh, VirusTotal, SecurityTrails, DNSDumpster

**Output:** Daftar subdomain historis

**Catatan:** Subdomain yang ditemukan tidak langsung dianggap valid — beri label **Likely** sampai diverifikasi.

---

### 6.7 DNS & WHOIS Analysis

**Tools:** whois lookup, dig, DNSDumpster

**Yang dicari:**

- MX record (email provider)
- TXT record (verifikasi layanan)
- IP / CDN yang digunakan

**Insight:**

- Infrastruktur cloud
- Third-party services

---

### 6.8 Document Metadata Extraction

**Tools:** ExifTool, FOCA

**Command:**

```
exiftool file.pdf
```

**Output:**

- Username internal
- Software yang digunakan
- File path tersembunyi

---

### 6.9 OSINT: People & Organization

**Tools:** LinkedIn, Twitter/X, halaman karir website target

**Yang dicari:**

- Tech stack dari job posting
- Struktur tim
- Nama karyawan

---

### 6.10 Email Pattern Analysis

**Sumber:** Kontak publik, metadata dokumen

**Contoh pola:**

- `firstname.lastname@domain.com`
- `firstinitial.lastname@domain.com`

---

## 7. Penyusunan Data Recon

Contoh tabel hasil recon:

| Field | Data | Source | Confidence |
| --- | --- | --- | --- |
| Domain | example.com | Website resmi | Confirmed |
| Subdomain | dev.example.com | crt.sh | Likely |
| Teknologi | WordPress | HTML source | Likely |

---

## 8. Penyusunan Hipotesis

Hipotesis yang baik harus:

1. Berdasarkan bukti yang ditemukan
2. Spesifik dan tidak ambigu
3. Bisa diverifikasi di fase active recon

**Format:**

```
Hipotesis : [pernyataan dugaan yang spesifik]
Dasar     : [informasi apa yang ditemukan dan dari mana]
Verifikasi: [cara membuktikannya saat active recon]
```

**Contoh:**

```
Hipotesis : Target kemungkinan menggunakan WordPress
Dasar     : Ditemukan path /wp-content/ di HTML source
Verifikasi: Cek endpoint WordPress saat active recon
```

```
Hipotesis : Terdapat admin panel di subdomain admin.target.com
Dasar     : Ada referensi "dashboard" di halaman About
Verifikasi: Akses subdomain saat active recon
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
- Tidak memberi confidence label
- Single-source conclusion — tidak melakukan triangulasi dari beberapa sumber

---

## 11. Prinsip Penting

**Passive Recon = Observasi, bukan interaksi.**

Aktivitas berikut termasuk active recon dan tidak dilakukan pada tahap ini:

- Port scanning
- Request langsung ke server
- Brute force
- Directory fuzzing

---

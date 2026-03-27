# Minggu 4: Enumeration dan Attack Surface Mapping

Enumerasi adalah fase ketika peserta mulai mengubah output scan mentah menjadi bukti yang lebih berguna. Di sini peserta belajar memilih teknik yang sesuai per service dan menyusun attack surface map sebagai dasar validasi minggu berikutnya.

<div align="center">

![Attack Surface Map](/miniclass/cyber/assets/penetration-testing/attack-surface-map.svg)

</div>

## Tujuan Pembelajaran

- Memahami peran enumeration dalam workflow pentest
- Melakukan enumerasi terhadap service umum seperti HTTP, SMB, FTP, SSH, dan DNS
- Menggunakan content discovery tool seperti Gobuster atau FFUF
- Membuat attack surface map dari hasil enumerasi

## Mindset Enumerasi

Scan memberi tahu bahwa service ada. Enumerasi membantu menjawab:

- apa yang sebenarnya terlihat dari service itu?
- apakah ada akses yang terlalu longgar?
- apakah ada endpoint, file, atau share yang tidak seharusnya terbuka?
- apakah ada tanda misconfiguration?

## Teknik Enumerasi Dasar

### HTTP

- buka service di browser
- periksa title, halaman login, error page, dan path menarik
- jalankan content discovery

Contoh:

```bash
gobuster dir -u http://192.168.56.101/ -w /usr/share/wordlists/dirb/common.txt
```

### FTP

- cek apakah anonymous login diizinkan
- lihat file apa yang tersedia

Contoh:

```bash
ftp 192.168.56.101
```

### SMB

- cek share dan informasi domain/user jika tersedia

Contoh:

```bash
enum4linux -a 192.168.56.101
```

### SSH

- perhatikan banner
- jangan buru-buru brute force
- gunakan hanya untuk mencatat versi, kebijakan auth, atau petunjuk konfigurasi

## Template Attack Surface Table

| Service | Evidence | Possible Weakness | Confidence | Next Step |
| --- | --- | --- | --- | --- |
| HTTP | `/admin` ditemukan | kemungkinan auth gap | Medium | validasi akses |
| FTP | anonymous login berhasil | file exposure | High | cek isi file |
| SMB | share tanpa auth | information disclosure | Medium | validasi path dan isi |

## Format Pengajaran Minggu 4

- `Teori`: review output scanning, peran enumeration, dan cara membangun attack surface map
- `Demo`: mentor menunjukkan enumerasi pada service utama seperti HTTP, FTP, atau SMB
- `Praktik`: peserta melakukan enumerasi terarah, menyusun attack surface table, dan memilih jalur validasi minggu berikutnya

## Praktikum Minggu 4

### Langkah Praktikum

1. Pilih dua sampai empat service utama dari hasil scan.
2. Enumerasi tiap service dengan metode yang sesuai.
3. Catat hasil yang benar-benar terbukti.
4. Susun attack surface table.
5. Pilih satu jalur yang paling menjanjikan untuk divalidasi di minggu 5.

## Deliverables

- attack surface map untuk target
- satu paragraf tentang jalur yang paling menjanjikan

## Output yang Diharapkan

- Peserta dapat bergerak dari scan data menuju hipotesis serangan
- Peserta dapat menjelaskan service mana yang paling menarik untuk diuji lebih lanjut

## Kesalahan Umum

- Menjalankan banyak tool tetapi tidak merangkum hasil
- Menyebut kelemahan hanya dari banner tanpa bukti tambahan
- Tidak menuliskan confidence level

## Tips Mentor

- Jika waktu terbatas, bagi service ke beberapa kelompok
- Fokuskan kelas pada service yang benar-benar mengajar konsep, misalnya HTTP, FTP, dan SMB

# Minggu 7: Password Attacks dan Credential Abuse

Minggu ini peserta mempelajari kelemahan autentikasi yang umum di lab: default credential, weak credential, credential reuse, serta dampaknya terhadap akses awal. Fokusnya tetap pada pembelajaran defensif dan pengujian yang aman.

## Tujuan Pembelajaran

- Memahami authentication weaknesses yang umum
- Menjelaskan perbedaan password spraying dan brute force
- Mengidentifikasi risiko default credential dan credential reuse
- Memahami peran wordlist dan rate-limiting awareness

## Jenis Kelemahan yang Sering Ditemui

### Default Credentials

Credential bawaan vendor atau instalasi default belum diubah.

### Weak Credentials

Password terlalu sederhana, mudah ditebak, atau mengikuti pola yang umum.

### Credential Reuse

Satu kredensial dipakai ulang pada beberapa service atau akun.

### Exposed Login Service

Login service terbuka dan mudah dicoba tanpa kontrol yang memadai.

## Password Spraying vs Brute Force

| Password Spraying | Brute Force |
| --- | --- |
| Satu password dicoba ke banyak akun | Banyak password dicoba ke satu akun |
| Lebih "pelan" dan kadang sulit terlihat | Lebih cepat memicu lockout |
| Tetap tidak boleh dilakukan di luar lab | Tetap tidak boleh dilakukan di luar lab |

## Prinsip Aman Saat Credential Testing

- hanya pada target yang disetujui
- volume percobaan dibatasi
- gunakan kredensial contoh atau petunjuk yang disediakan mentor
- hindari automation yang agresif

:::warning Context Matters
Tujuan sesi ini bukan mengajarkan credential attack di target nyata, tetapi menjelaskan mengapa kelemahan autentikasi dapat berdampak besar meski tekniknya terlihat sederhana.
:::

## Format Pengajaran Minggu 7

- `Teori`: konteks, etika credential testing, serta perbedaan weak credential, default credential, dan credential reuse
- `Demo`: mentor menunjukkan safe credential testing pada lab yang sudah disiapkan
- `Praktik`: peserta memvalidasi satu auth weakness dalam scope, lalu menuliskan dampak dan mitigasinya

## Praktikum Minggu 7

### Langkah Praktikum

1. Identifikasi login service yang tersedia.
2. Periksa apakah ada default credential yang memang disiapkan di lab.
3. Coba validasi satu auth weakness dalam scope yang ditentukan.
4. Jika berhasil mendapat akses, catat:

- akun yang digunakan
- service yang terdampak
- level akses
- bukti keberhasilan

## Contoh Pertanyaan Analisis

- Apakah issue ini hanya lemah secara teori, atau benar-benar memberi akses?
- Jika satu service terdampak, apakah service lain mungkin ikut terdampak?
- Apa perbaikan paling sederhana yang bisa dilakukan admin?

## Deliverables

- auth weakness write-up
- penjelasan singkat mengapa issue tersebut penting

## Output yang Diharapkan

- Peserta memahami jalur serangan autentikasi yang umum
- Peserta mampu mengaitkan temuan credential dengan konteks risiko

## Kesalahan Umum

- Menganggap credential issue selalu berarti privilege escalation
- Mencoba terlalu banyak kombinasi tanpa alasan
- Tidak menjelaskan mengapa issue ini berbahaya

## Rekomendasi Remediasi yang Baik

- ubah default credential
- pakai password policy yang lebih kuat
- terapkan rate limiting atau lockout yang wajar
- audit credential reuse
- tambahkan MFA jika relevan

# Minggu 2: Passive Reconnaissance dan OSINT

Passive recon adalah fase pengumpulan konteks target tanpa melakukan interaksi langsung ke sistem target. Ini adalah minggu untuk melatih rasa ingin tahu yang terstruktur: apa yang bisa diketahui hanya dari informasi publik atau paket mock target yang disiapkan mentor.

## Tujuan Pembelajaran

- Memahami perbedaan passive recon dan active recon
- Mengidentifikasi sumber informasi publik yang relevan
- Mengumpulkan domain, subdomain, email pattern, metadata, dan technology footprint
- Menyusun catatan recon yang rapi dan bisa diverifikasi

## Kenapa Passive Recon Penting

Sebelum melakukan scanning, peserta perlu punya tebakan awal tentang:

- service apa yang mungkin ada
- teknologi apa yang mungkin dipakai
- area mana yang layak diuji lebih lanjut

Passive recon membantu menghemat waktu dan mencegah peserta menguji target secara membabi buta.

## Passive Recon vs Active Recon

| Passive Recon | Active Recon |
| --- | --- |
| Tidak menyentuh target secara langsung | Menyentuh target secara langsung |
| Fokus pada informasi publik | Fokus pada host, port, service, dan response nyata |
| Cocok untuk membangun hipotesis | Cocok untuk memvalidasi keberadaan service |

## Sumber OSINT yang Aman untuk Pemula

- paket target yang disediakan mentor
- dokumentasi publik dari organisasi yang memang diizinkan
- screenshot atau materi tiruan
- metadata dokumen latihan
- petunjuk domain dan teknologi dari mentor

:::warning Jangan Open-Ended
Untuk kelas beginner, passive recon sebaiknya memakai mock target packet atau target demo yang sudah disiapkan. Hindari tugas OSINT yang terlalu terbuka karena bisa membuat peserta tersesat dan menyentuh target yang tidak tepat.
:::

## Format Catatan Recon Sederhana

| Field | Isi |
| --- | --- |
| Target name | Nama target |
| Known domains | Domain yang sudah diketahui |
| Suspected subdomains | Dugaan subdomain |
| Technology clues | Petunjuk stack seperti nginx, WordPress, React |
| Email pattern | Dugaan format email |
| Public services | Layanan yang mungkin tersedia |
| Confidence | Confirmed / likely / unknown |

## Format Pengajaran Minggu 2

- `Teori`: perbedaan passive recon dan active recon, sumber OSINT yang aman, dan cara membedakan fakta dari hipotesis
- `Demo`: mentor menunjukkan passive recon terhadap target aman atau mock target packet
- `Praktik`: peserta membaca target packet, mencatat temuan penting, lalu menyusun hipotesis awal

## Praktikum Minggu 2

### Langkah Praktikum

1. Baca target packet dari mentor.
2. Catat:

- nama target
- domain utama
- dua petunjuk teknologi
- pola email
- subdomain hint

3. Kelompokkan tiap informasi sebagai:

- confirmed
- likely
- unknown

4. Susun minimal tiga hipotesis.

Contoh hipotesis:

- target mungkin punya portal login pada subdomain
- aplikasi mungkin berbasis PHP
- mungkin ada panel admin yang hanya diketahui internal

## Deliverables

- satu halaman ringkasan passive recon yang memuat temuan utama dan hipotesis awal

## Output yang Diharapkan

- Peserta mampu membangun konteks target sebelum melakukan scanning
- Peserta memahami pentingnya sumber dan evidencing pada fase recon

## Kesalahan Umum

- Menyalin semua informasi tanpa memilah mana yang confirmed dan mana yang asumsi
- Menyebut hipotesis sebagai fakta
- Langsung pindah ke scanning padahal konteks target belum jelas

## Catatan 2 Jam

Gunakan mock target packet yang sudah dibatasi agar fokus sesi tetap pada teori, demo, dan praktik yang terarah, bukan pencarian internet yang terlalu luas.

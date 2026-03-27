# Prasyarat dan Ground Rules

Halaman ini memuat hal-hal yang harus dipahami peserta sebelum masuk ke aktivitas pentesting. Tujuannya sederhana: kelas berjalan aman, peserta tidak bingung secara teknis, dan praktik tetap berada dalam batas yang sah.

## Ground Rules

- Gunakan hanya target yang legal, aman, dan sudah mendapat izin
- Dilarang melakukan scanning atau eksploitasi pada sistem publik atau privat tanpa otorisasi
- Semua demo dan praktikum wajib dijalankan pada local lab, VM, CTF, atau safe online lab
- Peserta direkomendasikan menyimpan catatan, command log, screenshot, atau evidence untuk membantu dokumentasi belajar dan reporting
- Jika ragu apakah sebuah tindakan aman atau tidak, hentikan dulu dan tanyakan ke mentor

:::warning Aturan Paling Penting
Yang dipelajari di miniclass ini adalah metode berpikir dan alur kerja, bukan cara menyerang target nyata di luar lab. Tidak ada toleransi untuk praktik di luar scope.
:::

## Kenapa Prasyarat Itu Penting

Materi pentest cepat menjadi berat bila peserta belum nyaman dengan command line dan konsep jaringan. Karena itu, Linux basics dan networking basics dipindahkan ke self-study agar waktu live class dipakai untuk hal yang benar-benar khas pentest.

## Prasyarat Belajar Mandiri

### Linux Basics

Rekomendasi:

- [HackTheBox Academy - Linux Fundamentals](https://academy.hackthebox.com/app/module/18)
- [OverTheWire Bandit](https://overthewire.org/wargames/bandit/)

Target belajar:

- Navigasi shell dasar
- File permissions
- Editing file
- Pipes dan redirection
- Instalasi dan penggunaan tool sederhana

Perintah minimum yang sebaiknya sudah familiar:

```bash
pwd
ls -la
cd
cat
less
mkdir
cp
mv
grep
find
chmod
```

### Networking Basics

Rekomendasi:

- [HackTheBox Academy - Introduction to Networking](https://academy.hackthebox.com/app/module/34)

Target belajar:

- IP, port, dan protokol
- TCP vs UDP
- Client-server model
- Perbedaan host, service, dan aplikasi
- Dasar HTTP, DNS, dan routing sederhana

Konsep yang wajib dipahami:

| Konsep     | Kenapa Penting                         |
| ---------- | -------------------------------------- |
| IP address | Menentukan host yang sedang diuji      |
| Port       | Menunjukkan service yang diekspos      |
| Protocol   | Membantu memilih teknik enumerasi      |
| DNS        | Penting untuk recon dan web testing    |
| HTTP       | Dasar untuk web application pentesting |

## Kesiapan Mental Peserta

Selain teknis, peserta juga perlu punya ekspektasi yang benar:

- Tidak semua minggu akan berakhir dengan eksploitasi
- Banyak waktu justru habis di pemetaan, validasi, dan dokumentasi
- Tool tidak otomatis menghasilkan finding
- Temuan yang baik harus dapat dijelaskan ulang dengan rapi

## Checklist Kesiapan Peserta

- Sudah menyiapkan lingkungan Linux atau VM untuk praktikum
- Paham perintah shell dasar
- Paham konsep IP address, port, dan service
- Paham cara membaca output sederhana dari terminal
- Siap mengikuti aturan etika dan safe lab practice

## FAQ Singkat

### Apakah peserta harus sudah jago Linux?

Tidak. Peserta cukup memiliki kenyamanan dasar untuk bernavigasi di terminal dan menjalankan tool sederhana.

### Apakah peserta boleh mencoba target dari internet untuk latihan?

Tidak, kecuali target tersebut memang disediakan sebagai lab legal dan sudah disetujui mentor.

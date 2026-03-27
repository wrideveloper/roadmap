# Minggu 3: Active Reconnaissance dan Network Scanning

Minggu ini peserta mulai menyentuh target lab secara langsung. Fokusnya bukan menjalankan scan sebanyak mungkin, tetapi memahami kenapa scan dilakukan, bagaimana membaca output, dan bagaimana memilih service yang perlu dipelajari lebih lanjut.

## Tujuan Pembelajaran

- Memahami tujuan host discovery dan port scanning
- Menggunakan Nmap untuk quick scan dan detailed scan
- Mengidentifikasi port terbuka dan service yang mungkin berjalan
- Menyusun hipotesis awal berdasarkan hasil scanning

## Konsep Dasar

### Host Discovery

Host discovery dipakai untuk mengetahui host mana di subnet yang sedang hidup. Ini berguna jika mentor hanya memberi subnet, bukan IP target.

### Port Scanning

Port scan dipakai untuk mengetahui "pintu" mana yang terbuka. Port yang terbuka belum otomatis berarti vulnerability, tetapi menunjukkan service yang harus dipahami.

### Service Detection

Setelah tahu port yang terbuka, service detection membantu menebak service atau aplikasi apa yang berjalan, termasuk versinya.

## Perintah Dasar Nmap

```bash
nmap -sn 192.168.56.0/24
nmap -sV 192.168.56.101
nmap -sC -sV 192.168.56.101
```

Penjelasan singkat:

- `-sn` untuk host discovery
- `-sV` untuk version detection
- `-sC` untuk default scripts yang umum dan aman untuk lab beginner

## Cara Membaca Output Scan

Saat melihat hasil Nmap, jangan hanya mencatat port. Tanyakan:

- service ini biasanya dipakai untuk apa?
- apakah service ini butuh kredensial?
- apakah service ini cocok untuk enumerasi manual?
- apakah service ini lebih prioritas daripada yang lain?

## Format Pengajaran Minggu 3

- `Teori`: review hasil recon minggu 2, konsep scanning, dan safety boundary
- `Demo`: mentor memperlihatkan quick scan, version detection, dan cara membaca output Nmap
- `Praktik`: peserta melakukan host discovery, scanning dasar, lalu memilih service yang paling layak dienumerasi

## Praktikum Minggu 3

### Langkah Praktikum

1. Lakukan host discovery pada subnet lab.
2. Temukan host target.
3. Jalankan version detection scan.
4. Jalankan scan yang sedikit lebih detail.
5. Catat:

- port terbuka
- nama service
- versi atau banner
- service yang paling menarik

### Contoh Catatan Hasil

| Port | Service | Dugaan Fungsi | Prioritas |
| --- | --- | --- | --- |
| 22 | SSH | Remote shell | Medium |
| 80 | HTTP | Web app atau panel | High |
| 445 | SMB | File sharing dan enumerasi user/share | High |

## Deliverables

- scan notes
- tiga service yang diprioritaskan untuk enumerasi berikutnya

## Output yang Diharapkan

- Peserta mampu mengidentifikasi service yang terekspos
- Peserta dapat menentukan langkah enumeration lanjutan secara masuk akal

## Kesalahan Umum

- Menjalankan scan terlalu agresif tanpa tahu tujuan
- Tidak membedakan quick scan dan detailed scan
- Mencatat semua port tetapi tidak tahu mana yang layak diprioritaskan

## Tips Mentor

- Jika kelas terlalu lama di host discovery, berikan IP target secara langsung
- Untuk pemula, lebih baik membahas tiga service utama secara mendalam daripada seluruh port sekaligus

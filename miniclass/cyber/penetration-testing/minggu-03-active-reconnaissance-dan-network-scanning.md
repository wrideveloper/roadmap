# Minggu 3: Active Reconnaissance dan Network Scanning

Minggu ini peserta mulai menyentuh target lab secara langsung. Fokusnya bukan menjalankan scan sebanyak mungkin — tapi memahami kenapa scan dilakukan, bagaimana membaca output, dan bagaimana memilih service yang perlu digali lebih lanjut.

## Tujuan Pembelajaran

- Memahami tujuan host discovery dan port scanning
- Menggunakan Nmap untuk quick scan dan detailed scan
- Mengidentifikasi port terbuka dan service yang mungkin berjalan
- Menyusun hipotesis awal berdasarkan hasil scanning

## Konsep Dasar

### Host Discovery

Sebelum scan port, kita perlu tahu host mana yang aktif di jaringan. Host discovery mengirim probe ringan (biasanya ICMP echo atau ARP) ke semua IP di subnet, lalu mencatat mana yang merespons.

Kalau mentor sudah memberi IP target langsung, langkah ini bisa dilewati. Tapi kalau yang diberikan cuma subnet seperti `192.168.56.0/24`, host discovery adalah langkah pertama.

### Port Scanning

Setiap host punya 65.535 port. Port scan mengirim paket ke port-port tersebut untuk melihat mana yang merespons — artinya ada service yang sedang "mendengarkan" di sana.

Port terbuka belum otomatis berarti ada vulnerability. Tapi setiap port terbuka adalah service yang perlu dipahami: apa fungsinya, versinya berapa, dan apakah bisa dienumerasi lebih lanjut.

:::info
Port di bawah 1024 disebut *well-known ports* — sudah punya assignment resmi. Port 22 selalu SSH, port 80 selalu HTTP, port 443 selalu HTTPS. Port di atas 1024 lebih fleksibel dan bisa dipakai aplikasi apa saja.
:::

### Service Detection

Nmap bisa menebak service apa yang berjalan di balik port terbuka — termasuk versinya. Caranya dengan mengirim probe khusus dan membandingkan respons dengan database signature internal Nmap.

Versi service penting karena:
- Versi lama sering punya CVE yang sudah terdokumentasi
- Versi memberi konteks saat mencari exploit atau teknik enumerasi yang relevan

## Perintah Dasar Nmap
```bash
nmap -sn 192.168.56.0/24
nmap -sV 192.168.56.101
nmap -sC -sV 192.168.56.101
```

- `-sn` — host discovery, tidak scan port
- `-sV` — version detection, menebak service dan versinya
- `-sC` — jalankan default scripts, aman untuk lab beginner

## Flag Tambahan yang Sering Dipakai

Selain tiga perintah dasar di atas, ada flag lain yang sering muncul di lab dan CTF:

| Flag | Fungsi |
| --- | --- |
| `-T4` | Timing template — lebih cepat dari default, cocok untuk lab lokal |
| `-T1` / `-T2` | Lebih lambat, dipakai kalau ingin menghindari deteksi IDS |
| `-p-` | Scan semua 65.535 port, bukan hanya top 1000 |
| `-p 22,80,445` | Scan port spesifik saja |
| `--open` | Tampilkan hanya port yang terbuka |
| `-oN hasil.txt` | Simpan output ke file teks |
| `-oA hasil` | Simpan output ke tiga format sekaligus (txt, xml, grepable) |
| `-A` | Kombinasi `-sV -sC` plus OS detection dan traceroute |
| `-Pn` | Skip host discovery, anggap host selalu aktif (berguna kalau ping diblokir) |

:::warning
`-T5` (Insane) terlalu agresif dan sering menghasilkan false positive atau hasil yang tidak akurat. Untuk lab beginner, pakai `-T4` saja.
:::

Contoh kombinasi yang umum dipakai di lab:
```bash
# Quick scan semua port, simpan hasilnya
nmap -p- --open -T4 192.168.56.101 -oN quick.txt

# Detailed scan hanya port yang sudah diketahui terbuka
nmap -sC -sV -p 22,80,445 192.168.56.101 -oN detail.txt
```

Kenapa dipisah dua langkah? Karena scan semua port (`-p-`) butuh waktu lebih lama. Lebih efisien: temukan port dulu, baru jalankan version detection dan scripting hanya di port yang relevan.

## Cara Membaca Output Scan

Jangan hanya mencatat port. Untuk setiap service yang muncul, tanyakan:

- Service ini biasanya dipakai untuk apa?
- Apakah butuh kredensial?
- Apakah cocok untuk enumerasi manual?
- Seberapa prioritas dibanding service lain?

:::info
Kalau output Nmap menampilkan banner seperti `OpenSSH 7.4` atau `Apache httpd 2.4.18`, catat versinya. Versi itu bisa langsung dicari di [exploit-db.com](https://exploit-db.com) atau dengan `searchsploit` di terminal.
:::

## Format Pengajaran Minggu 3

- **Teori** — review hasil recon minggu 2, konsep scanning, dan safety boundary
- **Demo** — mentor memperlihatkan quick scan, version detection, dan cara membaca output Nmap
- **Praktik** — peserta melakukan host discovery, scanning dasar, lalu memilih service yang paling layak dienumerasi

## Praktikum Minggu 3

### Langkah Praktikum

1. Lakukan host discovery pada subnet lab.
2. Temukan host target.
3. Jalankan quick scan semua port dengan `-T4`.
4. Jalankan version detection dan default scripts hanya pada port yang terbuka.
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

- Scan notes
- Tiga service yang diprioritaskan untuk enumerasi berikutnya

## Output yang Diharapkan

- Peserta mampu mengidentifikasi service yang terekspos
- Peserta dapat menentukan langkah enumeration lanjutan secara masuk akal

## Kesalahan Umum

- Menjalankan scan terlalu agresif tanpa tahu tujuan
- Tidak membedakan quick scan dan detailed scan
- Mencatat semua port tapi tidak tahu mana yang layak diprioritaskan
- Langsung pakai `-A` di semua scan tanpa tahu apa yang dijalankan

## Tips Mentor

- Kalau kelas terlalu lama di host discovery, berikan IP target langsung
- Untuk pemula, lebih baik bahas tiga service utama secara mendalam daripada seluruh port sekaligus
- Kalau peserta bingung memilih prioritas, minta mereka jelaskan dulu fungsi masing-masing service sebelum memberi arahan

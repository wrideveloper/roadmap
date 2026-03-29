# Minggu 4: Enumeration dan Attack Surface Mapping

Enumerasi adalah fase ketika output scan mentah diubah menjadi bukti yang lebih berguna. Di sini peserta belajar memilih teknik yang sesuai per service dan menyusun attack surface map sebagai dasar validasi minggu berikutnya.

<div align="center">
![Attack Surface Map](/miniclass/cyber/assets/penetration-testing/attack-surface-map.svg)
</div>

## Tujuan Pembelajaran

- Memahami peran enumeration dalam workflow pentest
- Melakukan enumerasi terhadap service umum seperti HTTP, SMB, FTP, SSH, dan DNS
- Menggunakan content discovery tool seperti Gobuster atau FFUF
- Membuat attack surface map dari hasil enumerasi

## Mindset Enumerasi

Scan memberi tahu bahwa service ada. Enumerasi menjawab:

- Apa yang sebenarnya terlihat dari service itu?
- Apakah ada akses yang terlalu longgar?
- Apakah ada endpoint, file, atau share yang tidak seharusnya terbuka?
- Apakah ada tanda misconfiguration?

## Teknik Enumerasi Dasar

### HTTP

HTTP adalah service yang paling sering jadi entry point. Langkah pertama selalu manual — buka di browser, lihat apa yang ditampilkan, dan catat hal-hal yang tidak biasa sebelum menjalankan tool apapun.

Yang perlu diperhatikan saat inspeksi manual:
- Title halaman dan pesan error — sering bocorkan nama aplikasi atau framework
- Halaman login — catat path-nya, bukan langsung dicoba bypass
- Komentar HTML dan source code — kadang ada path tersembunyi atau kredensial hardcoded
- Header respons HTTP — bisa bocorkan versi server (`Server: Apache/2.4.18`)

Setelah inspeksi manual, jalankan content discovery untuk menemukan path yang tidak ditautkan di halaman utama:
```bash
# Gobuster — cepat, output bersih
gobuster dir -u http://192.168.56.101/ -w /usr/share/wordlists/dirb/common.txt

# Tambah ekstensi file yang umum
gobuster dir -u http://192.168.56.101/ -w /usr/share/wordlists/dirb/common.txt -x php,txt,html

# FFUF — alternatif Gobuster, lebih fleksibel untuk fuzzing
ffuf -u http://192.168.56.101/FUZZ -w /usr/share/wordlists/dirb/common.txt

# Nikto — scanner vulnerability HTTP dasar, cocok untuk pemula
nikto -h http://192.168.56.101
```

:::info
`common.txt` dari dirb cukup untuk lab pemula. Kalau ingin wordlist lebih besar, pakai `directory-list-2.3-medium.txt` dari SecLists — tapi waktu scan jadi lebih lama.
:::

| Tool | Kegunaan Utama |
| --- | --- |
| `gobuster` | Content discovery — cepat dan straightforward |
| `ffuf` | Fuzzing fleksibel, bisa untuk header, parameter, dan path |
| `nikto` | Scanner misconfiguration dan header HTTP |
| `curl -I` | Cek header respons secara manual |

---

### FTP

FTP (port 21) sering dikonfigurasi dengan anonymous login — artinya siapa saja bisa masuk tanpa kredensial. Ini bukan selalu kelemahan yang langsung exploitable, tapi bisa jadi sumber informasi penting.
```bash
# Koneksi manual
ftp 192.168.56.101

# Saat diminta username, ketik: anonymous
# Saat diminta password, ketik: (kosongkan atau isi email sembarang)
```

Setelah masuk, perintah dasar yang perlu diketahui:
```bash
ls        # lihat isi direktori
cd nama   # pindah direktori
get file  # download file ke lokal
bye       # keluar
```

:::warning
Jangan langsung upload file ke server FTP lab tanpa instruksi mentor. Fokus dulu pada enumerasi — lihat apa yang ada, bukan apa yang bisa dimasukkan.
:::

Alternatif kalau tidak mau pakai FTP interaktif:
```bash
# Cek anonymous login otomatis dengan Nmap script
nmap --script ftp-anon 192.168.56.101

# Download semua file sekaligus (kalau anonymous login berhasil)
wget -r ftp://192.168.56.101 --no-passive-ftp
```

| Tool | Kegunaan Utama |
| --- | --- |
| `ftp` | Koneksi manual, eksplorasi interaktif |
| `nmap --script ftp-anon` | Cek anonymous login otomatis |
| `wget -r ftp://...` | Download isi direktori sekaligus |

---

### SMB

SMB (port 445) adalah protokol file sharing Windows. Di lab, SMB sering jadi sumber informasi paling banyak — share yang terbuka, daftar user, dan informasi domain bisa terbaca tanpa autentikasi sama sekali.
```bash
# Enumerasi lengkap — user, share, grup, OS info
enum4linux -a 192.168.56.101

# Lihat daftar share yang tersedia
smbclient -L //192.168.56.101 -N

# Masuk ke share tertentu tanpa password
smbclient //192.168.56.101/NamaShare -N
```

Setelah masuk ke share via `smbclient`, perintahnya mirip FTP:
```bash
ls        # lihat isi share
get file  # download file
exit      # keluar
```

:::info
Flag `-N` pada `smbclient` artinya *no password* — cocok untuk mencoba akses tanpa autentikasi. Kalau berhasil masuk, itu sudah jadi bukti misconfiguration yang valid untuk dicatat di attack surface table.
:::

Alternatif tool:
```bash
# CrackMapExec — lebih cepat untuk enumerasi SMB di lab
crackmapexec smb 192.168.56.101

# Cek share dengan Nmap script
nmap --script smb-enum-shares 192.168.56.101
```

| Tool | Kegunaan Utama |
| --- | --- |
| `enum4linux` | Enumerasi komprehensif — user, share, OS, grup |
| `smbclient` | Akses share secara interaktif |
| `crackmapexec smb` | Enumerasi cepat, output ringkas |
| `nmap --script smb-enum-shares` | Cek share tanpa tool tambahan |

---

### SSH

SSH (port 22) jarang jadi entry point langsung untuk pemula — tapi tetap perlu dienumerasi. Tujuannya bukan brute force, melainkan mengumpulkan informasi dari banner dan konfigurasi yang terekspos.
```bash
# Lihat banner SSH
nc 192.168.56.101 22

# Cek versi dan algoritma yang didukung
nmap --script ssh2-enum-algos 192.168.56.101

# Cek apakah username enumeration mungkin dilakukan
nmap --script ssh-auth-methods --script-args="ssh.user=root" 192.168.56.101
```

Yang perlu dicatat dari hasil enumerasi SSH:
- Versi OpenSSH — cari di exploit-db kalau versinya lama
- Metode autentikasi yang diizinkan — kalau `password` diizinkan, ini bisa jadi kandidat brute force di fase eksploitasi
- Algoritma kriptografi — versi lama kadang pakai algoritma yang sudah deprecated

:::warning
Brute force SSH bukan bagian dari minggu ini. Kalau menemukan SSH dengan password auth, cukup catat dan tandai sebagai kandidat. Validasi dilakukan di minggu 5.
:::

| Tool | Kegunaan Utama |
| --- | --- |
| `nc host 22` | Ambil banner SSH secara manual |
| `nmap --script ssh2-enum-algos` | Lihat algoritma yang didukung |
| `nmap --script ssh-auth-methods` | Cek metode autentikasi yang aktif |

---

## Template Attack Surface Table

| Service | Evidence | Possible Weakness | Confidence | Next Step |
| --- | --- | --- | --- | --- |
| HTTP | `/admin` ditemukan | kemungkinan auth gap | Medium | validasi akses |
| FTP | anonymous login berhasil | file exposure | High | cek isi file |
| SMB | share tanpa auth | information disclosure | Medium | validasi path dan isi |

## Format Pengajaran Minggu 4

- **Teori** — review output scanning, peran enumeration, dan cara membangun attack surface map
- **Demo** — mentor menunjukkan enumerasi pada service utama seperti HTTP, FTP, atau SMB
- **Praktik** — peserta melakukan enumerasi terarah, menyusun attack surface table, dan memilih jalur validasi minggu berikutnya

## Praktikum Minggu 4

### Langkah Praktikum

1. Pilih dua sampai empat service utama dari hasil scan.
2. Enumerasi tiap service dengan metode yang sesuai.
3. Catat hasil yang benar-benar terbukti.
4. Susun attack surface table.
5. Pilih satu jalur yang paling menjanjikan untuk divalidasi di minggu 5.

## Deliverables

- Attack surface map untuk target
- Satu paragraf tentang jalur yang paling menjanjikan

## Output yang Diharapkan

- Peserta dapat bergerak dari scan data menuju hipotesis serangan
- Peserta dapat menjelaskan service mana yang paling menarik untuk diuji lebih lanjut

## Kesalahan Umum

- Menjalankan banyak tool tapi tidak merangkum hasil
- Menyebut kelemahan hanya dari banner tanpa bukti tambahan
- Tidak menuliskan confidence level

## Tips Mentor

- Kalau waktu terbatas, bagi service ke beberapa kelompok
- Fokuskan kelas pada service yang benar-benar mengajar konsep — misalnya HTTP, FTP, dan SMB

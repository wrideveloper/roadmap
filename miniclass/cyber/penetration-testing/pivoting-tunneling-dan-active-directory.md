# Pivoting, Tunneling, dan Active Directory

Ini adalah domain yang biasanya membedakan materi beginner dengan materi yang mulai bergerak ke level enterprise. Dalam banyak jalur modern, setelah foothold didapat, peserta diharapkan memahami cara bergerak lebih dalam ke network internal dan mengelola target berbasis Active Directory.

## Kenapa Domain Ini Penting

Di environment nyata:

- target tidak selalu langsung dapat dijangkau
- service penting sering berada di network internal
- Windows domain dan Active Directory sangat umum

Karena itu, jalur seperti PEN-200 dan HTB Penetration Tester Path memasukkan:

- port forwarding
- tunneling
- pivoting
- Active Directory enumeration
- AD attacks dan lateral movement

## Konsep Dasar

### Pivoting

Menggunakan host yang sudah compromised untuk menjangkau network atau host lain yang sebelumnya tidak dapat diakses.

### Port Forwarding

Mengarahkan traffic dari satu host atau port ke host atau port lain.

### Tunneling

Membungkus traffic di dalam protokol lain agar koneksi bisa melewati pembatasan jaringan.

## Port Forwarding dan Tunneling yang Perlu Dipahami

- SSH local port forwarding
- SSH dynamic port forwarding
- SSH remote port forwarding
- `socat`
- `sshuttle`
- `chisel`

Contoh konsep:

```bash
ssh -L 8080:10.10.10.5:80 user@pivot-host
```

Tujuan perintah seperti ini adalah membuka akses lokal ke service internal melalui host pivot.

## Quality Bar untuk Pivoting

Peserta yang benar-benar paham domain ini harus bisa menjawab:

- kenapa target internal tidak bisa diakses langsung?
- host mana yang berperan sebagai pivot?
- traffic diarahkan ke mana?
- tool apa yang paling ringan dan paling sesuai?

## Active Directory Basics

Sebelum mengajarkan serangan, peserta harus paham:

- apa itu domain
- apa itu user, group, computer object
- apa peran Domain Controller
- apa itu Kerberos dan NTLM pada level dasar

## AD Enumeration Dasar

Hal yang biasanya dicari:

- user dan group
- komputer yang ada
- service account
- share dan sesi user
- SPN
- privilege dan permission object tertentu

## AD Attack Concepts yang Relevan

Untuk mendekati kualitas OSCP/CPTS, peserta minimal perlu mengenal istilah dan alur berpikir:

- password attacks terhadap domain account
- AS-REP roasting
- Kerberoasting
- pass the hash
- pass the ticket
- lateral movement via WinRM, WMI, atau PsExec

:::warning Jangan Campur Semua Sekaligus
Untuk kelas beginner, jangan mengajar AD enumeration, Kerberoasting, pass-the-hash, dan lateral movement dalam satu sesi yang sama. Pecah menjadi beberapa lapis materi.
:::

## Strategi Pengayaan yang Realistis

Kalau ingin roadmap ini benar-benar menjadi jembatan ke OSCP/CPTS:

1. Tambahkan satu VM Windows domain kecil.
2. Ajarkan AD basics terpisah dari Linux basics.
3. Gunakan satu jalur serangan AD sederhana.
4. Fokus pada reasoning dan evidence, bukan tool spam.

## Mapping ke Roadmap Saat Ini

- setelah minggu 7 atau 8, peserta yang kuat dapat masuk ke track ini
- mentor dapat menjadikan halaman ini sebagai blueprint semester lanjutan

## Outcome yang Masuk Akal

Peserta belum harus ahli AD, tetapi setelah membaca halaman ini mereka seharusnya memahami bahwa:

- enterprise pentesting tidak berhenti pada satu host
- foothold sering hanyalah awal
- network segmentation dan AD membuat engagement jauh lebih kompleks

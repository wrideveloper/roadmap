# Tools dan Lab Platform

## Tool yang Digunakan di Kelas

| Tool                                              | Fungsi Utama                                           | Dipakai di Minggu           |
| ------------------------------------------------- | ------------------------------------------------------ | --------------------------- |
| Kali Linux, Parrot OS, WSL, atau bare metal Linux | Attacker environment                                   | 1 sampai 10                 |
| VirtualBox atau VMware                            | Menjalankan lab VM jika memilih pendekatan virtualized | 1 sampai 10                 |
| Nmap                                              | Host discovery, port scan, service detection           | 3 sampai 5                  |
| Wireshark                                         | Demonstrasi traffic analysis                           | 1, 3, atau sesuai kebutuhan |
| Gobuster atau FFUF                                | Web content discovery                                  | 4, 6                        |
| Burp Suite Community Edition                      | Intercept dan replay request web                       | 6                           |
| Nikto                                             | Web server checks tingkat dasar                        | Opsional                    |
| Searchsploit                                      | Mencari referensi exploit publik                       | 5                           |
| Netcat                                            | Cek koneksi atau shell sederhana                       | 5, 8                        |
| Metasploit                                        | Demonstrasi konsep, bukan jalur belajar utama          | Opsional                    |
| Markdown atau aplikasi note-taking                | Menyusun finding dan report                            | 8 sampai 10                 |

## Opsi Attacker Environment

Rekomendasi **VM tetap menjadi opsi default yang paling aman dan paling mudah dikelola**. Namun, peserta tidak harus selalu memakai VM. Beberapa opsi yang bisa dipakai:

### VM-Based Lab

Pilihan paling direkomendasikan untuk kelas bersama karena:

- Mudah di-reset
- Lebih aman untuk isolasi

### WSL

WSL cocok untuk peserta Windows yang ingin menjalankan tool CLI tanpa harus langsung membuat attacker VM penuh.

Kelebihan:

- Lebih ringan daripada VM penuh
- Nyaman untuk tool seperti `nmap`, `ffuf`, `gobuster`, `searchsploit`, dan `netcat`
- Cocok untuk latihan command-line dasar

Hal yang perlu diperhatikan:

- Beberapa skenario networking bisa berbeda dari VM-based lab
- Untuk tool GUI seperti Burp Suite atau Wireshark, lebih praktis dijalankan di Windows host atau melalui WSLg jika environment mendukung

### Bare Metal Linux

Bare metal berarti peserta menjalankan tool langsung di Linux host utama tanpa VM tambahan.

Kelebihan:

- Performa paling ringan
- Tidak ada overhead virtualisasi
- Cocok untuk peserta yang memang sudah memakai Linux sebagai daily driver

Hal yang perlu diperhatikan:

- Isolasi lebih lemah dibanding VM
- Perubahan package dan konfigurasi langsung memengaruhi mesin utama

:::info Rekomendasi Praktis
Jika perlu setup yang paling seragam, gunakan VM. Jika device terbatas, `WSL` atau bare metal Linux bisa dijadikan opsi cadangan selama target, dan tool tetap kompatibel.
:::

## Tahap Instalasi per Opsi

### Opsi 1: VM-Based Lab

Ini adalah jalur yang paling direkomendasikan untuk kelas bersama.

Sumber resmi yang bisa dipakai:

- [VirtualBox Downloads](https://www.virtualbox.org/wiki/Downloads)
- [VMware Workstation Pro Download Instructions](https://knowledge.broadcom.com/external/article/344595/downloading-vmware-workstation-pro.html)
- [Get Kali](https://www.kali.org/get-kali/)
- [Parrot OS Download](https://parrotsec.org/docs/introduction/download-parrot/)
- [Athena OS](https://athenaos.org/)

1. Install hypervisor seperti [VirtualBox](https://www.virtualbox.org/wiki/Downloads) atau [VMware Workstation Pro](https://knowledge.broadcom.com/external/article/344595/downloading-vmware-workstation-pro.html).
2. Download image [Kali Linux](https://www.kali.org/get-kali/) atau [Parrot OS](https://parrotsec.org/docs/introduction/download-parrot/) dalam format `ISO` atau `OVA`.
3. Jika memakai `OVA`, import appliance yang sudah jadi.
4. Jika memakai `ISO`, buat VM baru dengan alokasi minimal:

- 2 vCPU
- 4 GB RAM
- 30 sampai 40 GB storage

5. Atur network adapter agar dapat koneksi ke internet.
6. Boot VM dan selesaikan proses instalasi sistem operasi.
7. Jalankan update package setelah login pertama.
8. Verifikasi tool inti seperti `nmap`, `gobuster`, `ffuf`, `netcat`, dan browser.
9. Buat snapshot awal agar environment mudah di-reset jika rusak.

### Opsi 2: WSL

WSL cocok jika peserta memakai Windows dan ingin setup yang lebih ringan daripada VM penuh.

Sumber resmi yang bisa dipakai:

- [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Kali WSL Documentation](https://www.kali.org/docs/wsl/wsl-preparations/)
- [Get Kali](https://www.kali.org/get-kali/)

1. Aktifkan `WSL 2` dan `Virtual Machine Platform` dari Windows Features atau gunakan panduan resmi [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install).
2. Restart Windows jika diminta.
3. Install distro Linux yang dipilih, misalnya Ubuntu atau [Kali for WSL](https://www.kali.org/docs/wsl/wsl-preparations/).
4. Buat user Linux saat instalasi awal selesai.
5. Jalankan update package di environment WSL.
6. Install tool CLI inti yang dibutuhkan untuk kelas.
7. Jika memakai tool GUI, putuskan sejak awal apakah tool dijalankan di Windows host atau lewat `WSLg`.

Contoh verifikasi awal di WSL:

```bash
uname -a
ip a
nmap --version
ffuf -h
```

### Opsi 3: Bare Metal Linux

Bare metal cocok untuk peserta yang sudah nyaman memakai Linux sebagai sistem utama.

Sumber resmi yang bisa dipakai:

- [Get Kali](https://www.kali.org/get-kali/)
- [Parrot OS Download](https://parrotsec.org/docs/introduction/download-parrot/)
- [Athena OS](https://athenaos.org/)
- [Rufus](https://rufus.ie/en/)
- [balenaEtcher](https://etcher.balena.io/)
- [Ventoy](https://www.ventoy.net/en/download.html)

1. Backup data penting jika instalasi dilakukan pada mesin utama.
2. Download image installer [Kali Linux](https://www.kali.org/get-kali/), [Parrot OS](https://parrotsec.org/docs/introduction/download-parrot/), atau distro Linux yang lain.
3. Buat bootable USB dengan tool seperti [Rufus](https://rufus.ie/en/), [balenaEtcher](https://etcher.balena.io/), atau [Ventoy](https://www.ventoy.net/en/download.html).
4. Boot dari USB installer.
5. Pilih mode instalasi yang sesuai:

- Full install ke disk
- Dual boot
- Install ke device cadangan

6. Selesaikan instalasi sistem operasi dan login ke environment baru.
7. Jalankan update package.
8. Install atau verifikasi tool inti yang dipakai selama kelas.
9. Uji konektivitas ke target lab dan pastikan browser, terminal, dan tool dasar berjalan normal.

:::warning Bare Metal Lebih Berisiko
Bare metal memberi performa terbaik, tetapi perubahan package, network configuration, dan troubleshooting akan langsung memengaruhi mesin utama. VM tetap lebih aman jika device memungkinkan.
:::

## Verifikasi Minimum Setelah Instalasi

Terlepas dari opsi yang dipilih, peserta minimal harus bisa menjalankan:

```bash
ip a
ping -c 2 8.8.8.8
nmap --version
nc -h
```

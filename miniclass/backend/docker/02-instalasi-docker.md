# Instalasi Docker

::: info Prasyarat Modul
Kamu butuh akses administrator di komputer sendiri. Kalau memakai laptop kantor atau lab kampus yang dikunci, minta izin dulu sebelum install apa pun.
:::

Di pertemuan sebelumnya kita sepakat bahwa container adalah cara membungkus aplikasi beserta lingkungannya. Sekarang saatnya memasang alatnya.

<img width="480" src="/miniclass/backend/assets/docker/choosing-an-os-meme.jpeg">

Aku sengaja menaruh instalasi di awal, bukan di akhir, supaya setiap konsep berikutnya bisa langsung dicoba. Modul ini jauh lebih enak dipahami kalau kamu ikut mengetik perintahnya, bukan cuma membaca.

---

## Dua Cara Memasang Docker

Ada dua jalur yang perlu kamu tahu:

1. **Docker Desktop**: aplikasi lengkap dengan GUI, sudah termasuk Docker Engine, Compose, dan Kubernetes lokal. Paling mudah untuk pemula.
2. **Docker Engine langsung**: install paket Docker di sistem operasi, tanpa GUI. Lebih ringan dan biasa dipakai di server.

Untuk belajar di laptop, aku sarankan **Docker Desktop** dulu. Kalau nanti kamu deploy ke VPS Linux, baru pakai Docker Engine.

::: tip Pilih Sendiri, Tidak Wajib Sama
Tidak apa-apa memakai jalur yang berbeda dari temanmu. Yang penting di akhir modul ini perintah `docker run hello-world` berhasil.
:::

---

<img width="480" src="/miniclass/backend/assets/docker/windows-vs-linux-meme.png">

## Windows

Docker di Windows modern berjalan di atas **WSL 2** (Windows Subsystem for Linux). Ini bukan opsional. Tanpa WSL 2, container Linux tidak bisa jalan.

### Langkah 1: Aktifkan WSL 2

Buka PowerShell sebagai Administrator, lalu jalankan:

```powershell
wsl --install
```

Perintah ini memasang WSL dan satu distro Linux default. Setelah selesai, **restart komputer**.

Untuk memastikan versi WSL sudah 2:

```powershell
wsl --list --verbose
```

Kalau kolom VERSION masih 1, ubah dengan:

```powershell
wsl --set-default-version 2
```

### Langkah 2: Install Docker Desktop

1. Unduh dari halaman resmi Docker Desktop untuk Windows.
2. Jalankan installer. Pastikan opsi **Use WSL 2 instead of Hyper-V** tercentang.
3. Setelah install, buka Docker Desktop dan tunggu sampai statusnya **Running**.

### Langkah 3: Verifikasi

Buka PowerShell baru, lalu:

```powershell
docker version
docker run hello-world
```

Kalau muncul pesan `Hello from Docker!`, instalasimu berhasil.

::: warning Jangan Matikan Docker Desktop
Di Windows dan macOS, Docker Engine berjalan sebagai aplikasi latar. Kalau Docker Desktop ditutup, perintah `docker` akan gagal dengan pesan tidak bisa connect ke daemon. Ini penyebab error paling sering bagi pemula.
:::

---

## macOS

Di macOS, Docker Desktop adalah jalur paling umum. Ada dua hal yang perlu diperhatikan: chip dan lisensi.

### Langkah 1: Pilih installer yang benar

- **Apple Silicon (M1, M2, M3, M4)**: unduh versi **Apple Silicon**.
- **Intel**: unduh versi **Intel**.

Salah pilih installer tidak selalu langsung error, tapi performanya bisa buruk karena berjalan lewat emulasi.

### Langkah 2: Install

1. Buka file `.dmg`.
2. Seret Docker ke folder Applications.
3. Buka Docker. macOS akan meminta izin sistem. Setujui.
4. Tunggu sampai ikon paus di menu bar berhenti beranimasi.

### Langkah 3: Verifikasi

```bash
docker version
docker run hello-world
```

::: tip Alternatif Tanpa Docker Desktop
Kalau kamu tidak ingin memakai aplikasi berlisensi, ada **Colima** atau **OrbStack**. Keduanya menyediakan Docker Engine di macOS. Untuk modul ini Docker Desktop sudah cukup, jadi tidak perlu bingung memilih.
:::

---

## Linux

Di Linux, Docker Desktop biasanya berlebihan. Kita install Docker Engine langsung. Contoh di bawah memakai Ubuntu atau Debian. Untuk distro lain, sesuaikan perintah package manager-nya.

### Langkah 1: Install

Cara cepat, memakai paket dari repo distro:

```bash
sudo apt update
sudo apt install docker.io docker-compose-plugin
```

Cara yang disarankan Docker, memakai repo resmi, memberi versi lebih baru:

```bash
sudo apt update
sudo apt install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

Setelah key terpasang, tambahkan repo dan install:

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Langkah 2: Jalankan sebagai user biasa

Secara default, perintah `docker` hanya bisa dipakai `root` atau lewat `sudo`. Supaya tidak mengetik `sudo` terus, tambahkan user-mu ke grup `docker`:

```bash
sudo usermod -aG docker $USER
```

Lalu **logout dan login lagi**, atau jalankan:

```bash
newgrp docker
```

::: warning Soal Keamanan
Grup `docker` setara dengan akses root. Anggota grup itu bisa menjalankan container dengan akses penuh ke host. Di laptop pribadi ini wajar. Di server produksi bersama, pertimbangkan ini serius.
:::

### Langkah 3: Aktifkan saat boot

```bash
sudo systemctl enable --now docker
```

### Langkah 4: Verifikasi

```bash
docker version
docker run hello-world
```

---

## Cek Instalasi Secara Menyeluruh

Setelah `hello-world` berhasil, jalankan tiga perintah ini untuk memastikan semuanya sehat:

```bash
docker version
docker info
docker compose version
```

Yang kita cari:

- `docker version` menampilkan dua bagian, **Client** dan **Server**. Kalau bagian Server kosong, daemon belum jalan.
- `docker info` menampilkan jumlah container, image, dan driver penyimpanan. Kalau error, daemon bermasalah.
- `docker compose version` menampilkan versi Compose. Kita akan butuh ini di pertemuan kelima.

---

## Masalah yang Sering Muncul

| Gejala | Penyebab umum | Solusi |
| :--- | :--- | :--- |
| `Cannot connect to the Docker daemon` | Docker Desktop belum jalan, atau service mati | Buka Docker Desktop, atau `sudo systemctl start docker` |
| `permission denied while trying to connect` | User belum masuk grup `docker` | `sudo usermod -aG docker $USER`, lalu login ulang |
| `WSL 2 installation is incomplete` | WSL belum aktif atau versinya 1 | `wsl --install`, `wsl --set-default-version 2` |
| Container langsung mati | Proses utama di container selesai atau crash | Cek dengan `docker logs <nama>` |
| Port sudah dipakai | Ada aplikasi lain di port yang sama | Ganti port host, misal `-p 3001:3000` |

---

## Sedikit Tentang Arsitektur Docker

Docker yang kamu install sebenarnya terdiri dari beberapa bagian:

- **Docker CLI**: perintah `docker` yang kamu ketik.
- **Docker daemon (`dockerd`)**: layanan latar yang benar-benar mengelola image dan container.
- **containerd**: runtime yang menjalankan container.
- **runc**: program kecil yang berkomunikasi langsung dengan kernel untuk membuat isolasi.

Kita akan membongkar bagian `runc` dan kernel ini di bagian kedua modul. Untuk sekarang, cukup tahu bahwa perintah `docker` hanyalah ujung depan dari rantai panjang.

---

## Latihan

1. Install Docker di komputermu memakai jalur yang sesuai.
2. Jalankan `docker run hello-world` dan baca seluruh outputnya. Coba jelaskan tiga bagian pesan itu dengan bahasamu sendiri.
3. Jalankan `docker info`. Catat berapa jumlah container dan image saat ini.
4. Matikan Docker Desktop atau service Docker, lalu jalankan `docker ps`. Amati error-nya, lalu nyalakan lagi. Ini akan membantumu mengenali error yang sama nanti.

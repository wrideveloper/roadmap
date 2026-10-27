# Image, Container, dan CLI

::: info Prasyarat Modul
Docker sudah terpasang dan `docker run hello-world` berhasil. Kalau belum, selesaikan modul instalasi dulu.
:::

Sekarang kita masuk ke perintah yang akan kamu pakai setiap hari. Aku tidak akan menghabiskan halaman untuk daftar semua flag. Kita akan memakai satu contoh nyata, lalu membedah perintah-perintah yang muncul di sepanjang jalan.

Contoh kita: menjalankan web server Nginx di laptop sendiri.

---

## Registry: Tempat Image Disimpan

Sebelum menjalankan apa pun, kamu perlu image. Image disimpan di **registry**. Registry paling umum adalah **Docker Hub**, tempat publik berisi ribuan image siap pakai.

Alurnya seperti ini:

1. Kamu minta image ke registry dengan `docker pull`.
2. Docker mengunduh image dan menyimpannya di komputer lokal.
3. Kamu menjalankan image itu menjadi container.

Kalau kamu menjalankan `docker run` untuk image yang belum ada di lokal, Docker otomatis melakukan pull dulu. Jadi `pull` sering kali tidak perlu diketik manual.

```bash
docker pull nginx
```

Output-nya akan menunjukkan beberapa baris `Pull complete`. Setelah selesai, cek daftar image:

```bash
docker images
```

Kamu akan melihat kolom **REPOSITORY**, **TAG**, **IMAGE ID**, **CREATED**, dan **SIZE**.

::: tip Tag Itu Versi
`nginx` tanpa tag sama dengan `nginx:latest`. Di dunia nyata, hindari `latest` untuk produksi karena isinya bisa berubah tanpa kamu sadari. Pakai versi spesifik, misalnya `nginx:1.27-alpine`.
:::

---

## Menjalankan Container Pertama

Jalankan Nginx:

```bash
docker run -d -p 8080:80 --name web-ku nginx
```

Kalau berhasil, perintah ini hanya mengembalikan satu baris ID panjang. Tidak ada penjelasan apa pun. Mari kita bedah satu per satu:

| Bagian | Arti |
| :--- | :--- |
| `docker run` | Buat container baru dari sebuah image, lalu jalankan |
| `-d` | Detached, jalankan di latar belakang dan kembalikan terminal |
| `-p 8080:80` | Petakan port 8080 di host ke port 80 di dalam container |
| `--name web-ku` | Beri nama container, supaya mudah dirujuk nanti |
| `nginx` | Image yang dipakai |

Sekarang buka `http://localhost:8080` di browser. Kamu akan melihat halaman selamat datang Nginx. Selamat, kamu baru saja menjalankan server tanpa install Nginx di laptopmu.

Satu image, satu container. Kalau kamu menjalankan perintah yang sama dengan port dan nama berbeda, kamu mendapat container kedua dari image yang sama, tanpa mengunduh ulang.

<div align="center">

![Satu Image Banyak Container](/miniclass/backend/assets/docker/02-image-layer.svg)

</div>

### Soal port `-p 8080:80`

Urutannya selalu **host:container**. Angka kiri adalah pintu di komputermu, angka kanan adalah pintu di dalam container.

Nginx mendengarkan di port 80 di dalam container. Kalau kamu menulis `-p 80:80`, itu juga sah, asalkan port 80 di host belum dipakai. Aku memilih 8080 supaya tidak bentrok dengan server lain yang mungkin sedang jalan.

---

## Melihat Apa yang Sedang Berjalan

```bash
docker ps
```

Perintah ini menampilkan container yang **sedang hidup**. Untuk melihat semua container, termasuk yang sudah mati:

```bash
docker ps -a
```

Kolom yang penting:

- **CONTAINER ID**: ID pendek, bisa dipakai di perintah lain.
- **IMAGE**: image asal container.
- **STATUS**: `Up 2 minutes` atau `Exited (0) 5 minutes ago`.
- **PORTS**: pemetaan port, misalnya `0.0.0.0:8080->80/tcp`.
- **NAMES**: nama container.

---

## Melihat Log

Container yang berjalan di latar belakang tidak menulis ke terminalmu. Untuk melihat output-nya:

```bash
docker logs web-ku
```

Kalau kamu ingin terus mengikuti log seperti `tail -f`:

```bash
docker logs -f web-ku
```

Tekan `Ctrl+C` untuk berhenti mengikuti. Ini tidak mematikan container, hanya berhenti melihat log.

::: warning Log Bisa Membengkak
Secara default, Docker menyimpan log container di disk tanpa batas. Untuk container jangka panjang, atur rotasi log lewat opsi `--log-opt`. Ini hal kecil yang sering dilupakan sampai disk server penuh.
:::

---

## Masuk ke Dalam Container

Kadang kamu perlu melihat isi container dari dalam, misalnya untuk cek file konfigurasi. Perintahnya:

```bash
docker exec -it web-ku sh
```

Penjelasannya:

- `exec` menjalankan perintah baru di container yang **sudah berjalan**.
- `-i` menjaga input tetap terbuka.
- `-t` memberi terminal interaktif.
- `sh` adalah shell yang dijalankan. Image Alpine biasanya tidak punya `bash`, jadi `sh` lebih aman.

Setelah masuk, coba:

```bash
ls /usr/share/nginx/html
cat /etc/nginx/nginx.conf
exit
```

Kamu sedang berada di dalam file system container, terpisah dari file system laptopmu.

---

## Siklus Hidup Container

Container punya status yang jelas. Memahami ini membuat perintah CLI terasa masuk akal.

```text
docker run        -> membuat + menjalankan container baru
docker stop       -> menghentikan container yang berjalan
docker start      -> menjalankan lagi container yang berhenti
docker restart    -> stop lalu start
docker rm         -> menghapus container
```

Yang sering membingungkan: **`docker run` selalu membuat container baru**, sedangkan `docker start` memakai container lama yang sudah ada.

Kalau kamu menjalankan `docker run nginx` lima kali, kamu punya lima container. Kalau kamu `docker start web-ku` lima kali, kamu tetap punya satu container.

### Berhenti dan menghapus

```bash
docker stop web-ku
docker rm web-ku
```

Kalau container masih berjalan, `docker rm` akan menolak. Hentikan dulu, atau paksa dengan `-f` (hati-hati, ini mematikan paksa).

### Hapus image

```bash
docker rmi nginx
```

Image tidak bisa dihapus kalau masih dipakai container, bahkan container yang sedang berhenti. Hapus container-nya dulu.

---

## Container Sekali Pakai

Untuk eksperimen, kamu tidak ingin meninggalkan sampah. Dua flag ini sangat berguna:

```bash
docker run --rm -it alpine sh
```

- `--rm` otomatis menghapus container begitu prosesnya selesai.
- `-it` memberi shell interaktif.

Coba jalankan, lalu `exit`. Container langsung hilang dari `docker ps -a`.

::: tip Kebiasaan yang Baik
Biasakan memakai `--rm` untuk container yang sifatnya sementara: uji coba, menjalankan script, atau masuk ke shell. Ini menjaga daftar container tetap bersih.
:::

---

## Melihat Detail Container

Untuk informasi lengkap dalam format JSON:

```bash
docker inspect web-ku
```

Output-nya panjang. Kalau kamu hanya butuh satu bagian, gunakan `--format`:

```bash
docker inspect --format '{{.State.Status}}' web-ku
docker inspect --format '{{.NetworkSettings.IPAddress}}' web-ku
```

Untuk melihat pemakaian CPU dan RAM secara langsung:

```bash
docker stats
```

---

## Membersihkan Sampah

Setelah beberapa hari bereksperimen, biasanya menumpuk image dan container yang tidak terpakai. Cek dulu pemakaian disk:

```bash
docker system df
```

Lalu bersihkan yang benar-benar tidak terpakai:

```bash
docker system prune
```

::: danger Perintah Ini Menghapus Data
`docker system prune` menghapus container yang berhenti, network yang tidak dipakai, dan image dangling. Kalau kamu menambahkan `-a`, semua image yang tidak dipakai container ikut terhapus. Jangan jalankan ini di server produksi tanpa tahu isinya.
:::

---

## Latihan

1. Jalankan Nginx di port 8081 dengan nama `latihan-nginx`.
2. Buka di browser dan pastikan halamannya muncul.
3. Lihat log-nya, lalu masuk ke dalam container dan cari file `index.html`.
4. Hentikan container, lalu jalankan lagi dengan `docker start`. Apakah konfigurasi port-nya tetap sama?
5. Hapus container dan image Nginx yang kamu pakai.
6. Tantangan: jalankan image `alpine` dengan `--rm`, lalu cetak isi file `/etc/os-release` tanpa masuk ke shell interaktif. Petunjuk: `docker run --rm alpine cat /etc/os-release`.

# Docker Itu Sebenarnya Apa

::: info Prasyarat Modul
Ini pertemuan terakhir. Kamu sudah mencoba chroot, namespaces, dan cgroups. Sekarang kita rangkai semuanya menjadi satu gambar besar.
:::

Jadi, setelah semua ini, apa sebenarnya container itu? Satu kalimat:

**Container bukan mesin. Container adalah proses biasa yang diberi batas dan pandangan sendiri.**

Kalau kamu paham kalimat itu, kamu tidak akan lagi menganggap Docker sebagai `blek mejik`. Kamu juga akan lebih cepat mendiagnosis masalah, karena kamu tahu lapisan mana yang harus diperiksa.

---

## Rangkuman Perjalanan

Mari kita lihat lagi apa yang sudah dibongkar:

| Pertemuan | Yang dipelajari | Inti |
| :--- | :--- | :--- |
| 01 | Kenapa container ada | Konsistensi lingkungan, container vs VM |
| 02 | Instalasi | CLI, daemon, containerd, runc |
| 03 | Image dan container | Registry, lifecycle, CLI |
| 04 | Dockerfile | Layer, cache, build |
| 05 | Compose | Banyak service, satu file |
| 06 | Volume dan network | Data persisten, DNS internal |
| 07 | chroot | Root file system sendiri |
| 08 | Namespaces | Pandangan proses, network, hostname sendiri |
| 09 | cgroups | Batas CPU, RAM, dan proses |

---

## Anatomi Satu Perintah `docker run`

Ketika kamu mengetik:

```bash
docker run -d -p 8080:80 --name web nginx
```

Yang sebenarnya terjadi kira-kira seperti ini:

1. **CLI** mengirim permintaan ke **Docker daemon** lewat socket.
2. Daemon memeriksa apakah image `nginx` ada di lokal. Kalau tidak, dia menariknya dari registry.
3. Daemon meminta **containerd** menyiapkan container.
4. containerd memanggil **runc**.
5. runc memakai fitur kernel untuk:
   - menyiapkan root file system dari image,
   - membuat namespace baru,
   - menerapkan batas cgroup,
   - menjalankan proses `nginx`.
6. Setelah proses berjalan, runc keluar. Container tetap hidup karena prosesnya masih jalan.
7. Daemon mencatat status dan mengembalikan ID container ke CLI.

<div align="center">

![Arsitektur Docker: client, daemon, dan registry](/miniclass/backend/assets/docker/docker-anatomy.png)

<sub>Arsitektur Docker: Client, Docker Daemon, dan Registry</sub>

</div>

> Sumber gambar: CanTech, [What is Docker?](https://www.cantech.in/blog/what-is-docker/)

Perhatikan bahwa Docker tidak menjalankan container. **Kernel yang menjalankan proses.** Docker hanya menyiapkan kondisi supaya proses itu terisolasi dan terbatas.

---

## Lapisan-Lapisan Docker

### Docker CLI

Program yang kamu ketik. Tugasnya menerjemahkan perintah menjadi API call ke daemon. CLI tidak butuh akses root, karena dia hanya bicara lewat socket.

### Docker daemon (`dockerd`)

Layanan latar yang mengelola image, container, network, dan volume. Dia yang menyimpan state dan berkomunikasi dengan containerd.

### containerd

Runtime tingkat tinggi yang mengelola siklus hidup container. containerd juga dipakai oleh Kubernetes, jadi dia bukan eksklusif milik Docker.

### runc

Runtime tingkat rendah yang benar-benar membuat namespace, menerapkan cgroup, dan mengeksekusi proses. runc mengikuti spesifikasi OCI.

::: tip Rantai yang Sama di Banyak Alat
Karena containerd dan runc mengikuti standar, container yang dibuat Docker bisa dijalankan oleh Podman, Kubernetes, atau nerdctl. Image-nya kompatibel. Ini yang membuat ekosistem container tidak terkunci pada satu vendor.
:::

---

## OCI: Standar yang Menyatukan

**Open Container Initiative (OCI)** mendefinisikan dua spesifikasi utama:

- **Image spec**: format image, layer, dan manifest. Inilah sebabnya image Docker bisa dipakai di Podman.
- **Runtime spec**: cara runtime membuat dan menjalankan container. Inilah sebabnya runc bisa dipakai oleh banyak alat.

Docker adalah produk yang populer, tapi fondasinya adalah standar terbuka. Ini penting untuk kamu tahu, karena di dunia kerja kamu akan bertemu banyak alat yang saling bicara lewat standar yang sama.

---

## Isi Sebenarnya Sebuah Image

Kalau kamu membongkar image, isinya bukan file ISO atau disk image. Image adalah kumpulan **layer** yang ditumpuk.

Setiap layer adalah arsip berisi perubahan file: file baru, file yang diubah, atau file yang dihapus. Saat container dijalankan, layer-layer itu digabung menjadi satu file system read-only, lalu ditambah satu lapisan tulis di atasnya.

Itu sebabnya:

- Image bisa di-share dengan hemat, karena layer yang sama tidak diunduh ulang.
- Build bisa cepat, karena layer yang tidak berubah diambil dari cache.
- Container bisa start dalam hitungan detik, karena tidak ada instalasi ulang.

---

## Container Bukan VM, Tapi Bukan Juga Tanpa Isolasi

Di awal modul kita bilang container lebih ringan dari VM. Itu benar. Tapi jangan salah paham: container tetap punya isolasi yang serius.

| Aspek | VM | Container |
| :--- | :--- | :--- |
| Kernel | Sendiri | Berbagi dengan host |
| Isolasi | Sangat kuat, batas hardware virtual | Kuat, tapi bergantung konfigurasi kernel |
| Ukuran | GB | MB |
| Start | Puluhan detik | Kurang dari satu detik |
| Kepadatan | Rendah | Tinggi |

Container dengan konfigurasi yang buruk, misalnya `--privileged` tanpa alasan, bisa menjadi lubang keamanan. Isolasi container sangat bergantung pada namespace dan cgroup yang dipasang dengan benar.

::: warning `--privileged` Bukan Solusi Cepat
Kalau container gagal jalan dan solusinya adalah menambahkan `--privileged`, kamu sedang mematikan hampir semua isolasi. Cari penyebab sebenarnya: permission file, device yang hilang, atau capability yang kurang. Pakai `--privileged` hanya untuk debugging sementara.
:::

---

## Kapan Memakai Container, Kapan Tidak

Container sangat cocok untuk:

- Aplikasi web dan API.
- Worker dan job queue.
- Lingkungan development yang konsisten.
- CI/CD, karena build dan test bisa jalan di lingkungan yang sama.
- Microservices, karena setiap service bisa dibungkus terpisah.

Container kurang cocok untuk:

- Aplikasi yang butuh kernel modul khusus, kecuali kamu mengonfigurasi host dengan benar.
- Beban kerja yang butuh akses hardware langsung, misalnya GPU tanpa setup khusus.
- Aplikasi desktop dengan GUI kompleks, walaupun secara teknis bisa.
- Database berskala sangat besar tanpa perencanaan storage yang matang.

---

## Alternatif Docker

Docker bukan satu-satunya alat. Beberapa alternatif yang akan kamu temui:

- **Podman**: daemonless, sering dipakai di lingkungan yang menuntut keamanan lebih ketat.
- **containerd + nerdctl**: lebih dekat ke runtime, populer di Kubernetes.
- **LXC/LXD**: container sistem, bukan container aplikasi.
- **Firecracker**: microVM, isolasi lebih kuat dengan start cepat.

Yang penting bukan hafal daftarnya, tapi paham bahwa semuanya memakai primitif kernel yang sama: namespace, cgroups, dan file system.

---

## Checklist Kompetensi

Setelah menyelesaikan modul ini, kamu seharusnya bisa:

- [ ] Menjelaskan beda image dan container.
- [ ] Menulis Dockerfile dan memahami layer cache.
- [ ] Menjalankan multi-service dengan Compose.
- [ ] Memilih antara bind mount dan named volume.
- [ ] Menjelaskan kenapa `localhost` tidak bekerja antar container.
- [ ] Menjelaskan peran chroot, namespaces, dan cgroups.
- [ ] Mendiagnosis container yang mati karena OOM.
- [ ] Menjelaskan alur `docker run` dari CLI sampai kernel.

Kalau ada yang belum yakin, tidak perlu malu membuka lagi modul sebelumnya. Container adalah topik yang lebih mudah dipahami setelah dipakai berulang kali.

---

## Langkah Selanjutnya

Setelah modul ini, arah yang wajar untuk kamu ambil:

1. **Docker di proyek nyata**: ubah satu proyek Laravel atau Node.js milikmu menjadi image, lalu jalankan dengan Compose.
2. **CI/CD**: pakai container untuk build dan test otomatis di GitHub Actions.
3. **Kubernetes**: pelajari cara mengelola banyak container di banyak mesin. Ini kelanjutan alami dari System Design.
4. **Keamanan container**: pelajari image scanning, user non-root, dan pembatasan capability.

---

## Latihan Akhir

1. Ambil satu proyek backend yang pernah kamu buat. Tulis Dockerfile untuk proyek itu.
2. Tambahkan database dan cache lewat Compose.
3. Pastikan data database bertahan setelah `docker compose down` dan `up` lagi.
4. Jalankan dengan batas memori yang wajar, lalu cek `docker stats`.
5. Tulis satu paragraf: apa yang paling mengubah cara kamu memahami container setelah modul ini?
6. Tantangan: jelaskan ke temanmu, tanpa membuka catatan, alur lengkap `docker run` sampai proses berjalan di kernel.

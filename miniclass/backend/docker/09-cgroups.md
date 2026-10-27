# cgroups

::: info Prasyarat Modul
Kamu sudah paham namespace. Sekarang kita tambal kekurangan kedua: container bisa memakai seluruh CPU dan RAM host kalau tidak dibatasi.
:::

Namespace memberi container dunianya sendiri. Tapi dunia itu masih boleh memakai resource sepuasnya. Kalau aplikasi di dalam container punya memory leak, dia bisa menghabiskan RAM host dan membuat container lain ikut mati.

**cgroups** (control groups) adalah fitur kernel yang membatasi dan menghitung pemakaian resource. Ini yang membuat container bisa punya "jatah" CPU dan RAM.

---

## Namespace vs cgroups

Dua konsep ini sering dicampur. Bedanya sederhana:

- **Namespace** mengatur **apa yang bisa dilihat** proses.
- **cgroups** mengatur **berapa banyak resource yang bisa dipakai** proses.

Namespace itu soal isolasi pandangan. cgroups itu soal pembatasan dan akuntansi. Container butuh keduanya.

Contoh nyata: container dengan batas 100 MB yang aplikasinya kehabisan memori. Kernel membunuhnya, dan Docker mencatatnya sebagai OOMKilled:

```bash
kamu@laptop:~$ docker run -d --memory=100m --name app-batas app-sederhana:1.0
9f3a2b1c4d5e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2

kamu@laptop:~$ docker stats --no-stream app-batas
CONTAINER   CPU %   MEM USAGE / LIMIT   MEM %
app-batas   0.15%   92.41MiB / 100MiB   92.41%

kamu@laptop:~$ docker ps -a --filter "name=app-batas"
CONTAINER   STATUS
app-batas   Exited (137) 8 seconds ago

kamu@laptop:~$ docker inspect --format '{{.State.OOMKilled}}' app-batas
true
```

Exit code `137` dan status `OOMKilled` adalah tanda paling umum bahwa batas memori terlalu kecil.

---

## cgroups Versi 1 dan 2

Ada dua generasi cgroups:

- **cgroup v1**: setiap resource punya hierarki sendiri. CPU di satu pohon, memory di pohon lain. Rumit dan sering tidak konsisten.
- **cgroup v2**: satu hierarki terpadu untuk semua resource. Lebih rapi, dan sekarang menjadi standar di distro modern.

Cek versi yang dipakai sistemmu:

```bash
mount | grep cgroup
```

Kalau kamu melihat `cgroup2` di `/sys/fs/cgroup`, kamu memakai v2. Kalau melihat banyak baris dengan `cgroup` saja, kamu di v1 atau mode campuran.

::: tip Kalau Memakai Docker Desktop
Di macOS dan Windows, cgroups berjalan di dalam VM Linux yang dikelola Docker Desktop. Kamu tidak bisa mengaksesnya langsung dari terminal host. Untuk latihan cgroups, gunakan Linux asli, WSL 2, atau container dengan akses ke `/sys/fs/cgroup`.
:::

---

## Melihat Batas Resource

Setiap container yang berjalan punya direktori cgroup sendiri. Cari ID container:

```bash
docker ps -q
```

Lalu lihat batas memorinya di host Linux:

```bash
cat /sys/fs/cgroup/system.slice/docker-<container-id>.scope/memory.max
```

Kalau kamu melihat angka, itu batas dalam byte. Kalau melihat `max`, artinya tidak ada batas.

Untuk CPU, file-nya `cpu.max`. Isinya dua angka: kuota dan periode. Misalnya `50000 100000` berarti 0.5 CPU.

---

## Membatasi Resource dengan Docker

Kita tidak perlu mengatur cgroup manual untuk memakai fiturnya. Docker menyediakan flag yang menerjemahkan ke cgroup.

### Batas memori

```bash
docker run -d --name app-kena-batas --memory=128m app-sederhana:1.0
```

Kalau aplikasi mencoba memakai lebih dari 128 MB, kernel akan membunuh prosesnya. Container berhenti dengan status **OOMKilled**.

Cek:

```bash
docker inspect --format '{{.State.OOMKilled}}' app-kena-batas
docker inspect --format '{{.State.ExitCode}}' app-kena-batas
```

Exit code `137` berarti proses dihentikan oleh sinyal `SIGKILL`. Dalam konteks ini, penyebabnya biasanya OOM.

### Batas CPU

```bash
docker run -d --cpus=0.5 --name app-setengah-cpu app-sederhana:1.0
```

Artinya container hanya boleh memakai setara setengah core CPU. Kalau host punya 8 core, container ini tidak akan bisa memakai lebih dari 0.5 core, sekalipun CPU sedang idle.

### Batas jumlah proses

```bash
docker run -d --pids-limit=100 --name app-batas-proses app-sederhana:1.0
```

Ini mencegah **fork bomb**, yaitu program yang terus membuat proses sampai sistem kehabisan resource.

### Melihat pemakaian

```bash
docker stats
```

Kolom **MEM USAGE / LIMIT** menunjukkan berapa yang dipakai dibanding batas. Kolom **CPU %** menunjukkan pemakaian relatif.

::: warning Batas Bukan Jaminan Performa
`--memory=128m` membatasi, bukan menjamin. Kalau host kekurangan RAM, container tetap bisa lambat. cgroups mengatur batas atas dan akuntansi, bukan alokasi eksklusif.
:::

---

## Mencoba OOM Secara Sengaja

Kita akan membuat program kecil yang memakan memori, lalu membatasinya.

Buat file `makan-memori.js`:

```javascript
const chunk = [];
setInterval(() => {
  chunk.push(Buffer.alloc(10 * 1024 * 1024, 1));
  console.log(`alokasi: ${chunk.length * 10} MB`);
}, 500);
```

Jalankan dengan batas 100 MB:

```bash
docker run --rm --memory=100m -v "$(pwd)":/app -w /app node:20-alpine node makan-memori.js
```

Beberapa detik kemudian proses akan mati. Cek dengan:

```bash
docker ps -a
```

Statusnya akan menunjukkan `Exited (137)`.

Kalau kamu ingin melihat pesan dari kernel, jalankan `dmesg` di host Linux:

```bash
sudo dmesg | grep -i "killed process"
```

Kamu akan melihat catatan bahwa kernel membunuh proses karena melewati batas cgroup.

---

## Bagaimana Aplikasi Mengetahui Batasnya

Di dalam container, aplikasi membaca `/proc/meminfo` dan `os.totalmem()` dan bisa saja melihat RAM host, bukan batas cgroup. Ini sumber bug klasik: aplikasi mengira punya 16 GB, lalu mengalokasikan heap besar, lalu dibunuh kernel.

Solusinya:

- Gunakan pengaturan heap yang sadar container, misalnya `--max-old-space-size` di Node atau `MaxRAMPercentage` di Java.
- Atau pakai versi runtime yang sudah membaca cgroup secara otomatis.

::: tip Node dan cgroups
Node versi baru sudah lebih baik membaca batas cgroup untuk heap default, tapi belum sempurna di semua kasus. Untuk aplikasi produksi, eksplisit mengatur batas heap lebih aman.
:::

---

## Ringkasan Tiga Lapisan

Sekarang kamu sudah punya gambaran lengkap. Container modern terbentuk dari tiga lapisan:

| Lapisan | Fungsi | Modul |
| :--- | :--- | :--- |
| chroot | Memberi root file system sendiri | 07 |
| Namespace | Memberi pandangan proses, network, hostname sendiri | 08 |
| cgroups | Membatasi CPU, RAM, dan jumlah proses | 09 |

Docker membungkus ketiganya, menambahkan image, dan memberi antarmuka yang nyaman. Di pertemuan terakhir, kita akan merangkum semuanya.

---

## Latihan

1. Jalankan container dengan `--memory=64m`, lalu cek nilai `memory.max` di cgroup-nya.
2. Jalankan program `makan-memori.js` dengan batas 100 MB. Catat exit code dan status OOM.
3. Jalankan container dengan `--cpus=0.25`. Gunakan `docker stats` untuk melihat apakah pemakaian CPU benar-benar dibatasi.
4. Coba `--pids-limit=20`, lalu jalankan perintah yang membuat banyak proses. Amati apa yang terjadi.
5. Tantangan: jelaskan kenapa aplikasi bisa salah membaca jumlah RAM di dalam container, dan bagaimana cara memperbaikinya.

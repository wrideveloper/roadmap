# Dockerfile

::: info Prasyarat Modul
Kamu sudah bisa menjalankan container dari image publik. Sekarang kita belajar membuat image sendiri.
:::

Sampai sini kita hanya memakai image orang lain. Itu berguna untuk database, cache, atau web server siap pakai. Tapi aplikasimu sendiri belum punya image. Di sinilah **Dockerfile** masuk.

Dockerfile adalah file teks berisi instruksi untuk membangun image. Anggap saja dia resep: setiap baris menambah satu lapisan ke image akhir.

---

## Aplikasi Contoh

Kita mulai dari aplikasi Node.js kecil. Buat folder baru, lalu isi tiga file berikut.

`package.json`

```json
{
  "name": "app-sederhana",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

`server.js`

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ pesan: "Halo dari dalam container" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server jalan di port ${port}`);
});
```

`Dockerfile` (tanpa ekstensi)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

Build image-nya:

```bash
docker build -t app-sederhana:1.0 .
```

Lalu jalankan:

```bash
docker run -d -p 3000:3000 --name app-ku app-sederhana:1.0
```

Buka `http://localhost:3000`. Kamu akan melihat JSON dari aplikasimu, berjalan di dalam container.

---

## Membedah Instruksi

### `FROM`

```dockerfile
FROM node:20-alpine
```

Menentukan image dasar. Semua instruksi setelahnya berjalan di atas image ini.

`node:20-alpine` artinya Node versi 20 di atas Alpine Linux, distro yang sangat kecil. Ukurannya sekitar 130 MB, jauh lebih kecil dari `node:20` biasa yang hampir 1 GB.

### `WORKDIR`

```dockerfile
WORKDIR /app
```

Menentukan direktori kerja di dalam image. Kalau direktori belum ada, Docker membuatnya. Semua `RUN`, `COPY`, dan `CMD` setelah ini berjalan relatif terhadap `/app`.

::: tip Kenapa Pakai WORKDIR
Jangan memakai `RUN cd /app` lalu berharap instruksi berikutnya ikut pindah. Setiap instruksi Dockerfile berjalan di shell baru, jadi `cd` tidak bertahan. `WORKDIR` yang benar.
:::

### `COPY`

```dockerfile
COPY package*.json ./
COPY . .
```

Menyalin file dari komputer host ke dalam image. Argumen pertama adalah sumber, kedua tujuan.

`package*.json` menangkap `package.json` dan `package-lock.json` sekaligus. Perhatikan titik di akhir: itu berarti direktori kerja saat ini, yaitu `/app`.

### `RUN`

```dockerfile
RUN npm install --omit=dev
```

Menjalankan perintah **saat build**, bukan saat container jalan. Hasilnya ikut tersimpan di dalam image. Karena itu dependency tidak perlu di-install ulang setiap container dinyalakan.

### `EXPOSE`

```dockerfile
EXPOSE 3000
```

Mendokumentasikan bahwa aplikasi mendengarkan di port 3000. Ini **tidak** membuka port ke host. Port tetap harus dipetakan saat `docker run -p`, atau lewat Compose.

::: warning EXPOSE Bukan Port Mapping
Banyak pemula mengira `EXPOSE` sudah cukup supaya bisa diakses dari browser. Bukan. `EXPOSE` hanya metadata. Tanpa `-p`, container tetap tidak bisa diakses dari luar.
:::

### `CMD`

```dockerfile
CMD ["node", "server.js"]
```

Perintah default saat container dijalankan. Format kurung siku disebut **exec form**. Ini yang disarankan karena tidak lewat shell, sehingga sinyal seperti `SIGTERM` diterima langsung oleh proses.

Kalau kamu menulis `CMD node server.js` (shell form), Docker menjalankannya lewat `sh -c`, dan sinyal bisa tidak sampai ke Node. Akibatnya `docker stop` terpaksa menunggu timeout lalu membunuh paksa.

---

## `CMD` vs `ENTRYPOINT`

Dua instruksi ini sering tertukar.

| Aspek | `CMD` | `ENTRYPOINT` |
| :--- | :--- | :--- |
| Fungsi | Perintah default | Perintah utama yang selalu jalan |
| Bisa ditimpa | Ya, dengan argumen `docker run` | Tidak, kecuali pakai `--entrypoint` |
| Posisi | Biasanya di akhir Dockerfile | Biasanya sebelum `CMD` |
| Contoh | `CMD ["node", "server.js"]` | `ENTRYPOINT ["node"]` |

Kalau keduanya dipakai bersamaan, `CMD` menjadi argumen default untuk `ENTRYPOINT`:

```dockerfile
ENTRYPOINT ["node"]
CMD ["server.js"]
```

Menjalankan `docker run app-sederhana lain.js` akan mengeksekusi `node lain.js`.

Untuk sebagian besar aplikasi, `CMD` saja sudah cukup. `ENTRYPOINT` berguna kalau image-mu memang sebuah alat yang menerima argumen, misalnya image `curl` atau `terraform`.

---

## Layer dan Cache Build

Ini bagian yang paling berdampak ke kecepatan kerja sehari-hari.

Setiap instruksi di Dockerfile menghasilkan satu **layer**. Docker menyimpan layer di cache. Saat kamu build ulang, Docker memeriksa apakah instruksi dan isi file yang terlibat berubah. Kalau tidak berubah, layer lama dipakai lagi.

<div align="center">

![Setiap instruksi Dockerfile menjadi satu layer](/miniclass/backend/assets/docker/03-build-cache-stack.png)

<sub>Setiap instruksi menjadi satu layer image</sub>

</div>

> Sumber gambar: Docker, [Docker build cache](https://docs.docker.com/build/cache/)

Kalau sebuah layer berubah, semua layer di bawahnya ikut dibangun ulang, walaupun isinya tidak berubah. Pada contoh di bawah, perubahan di file `main.c` membuat Docker membatalkan cache untuk layer `COPY` dan semua layer setelahnya:

<div align="center">

![Cache invalidation membuat semua layer di bawahnya dibangun ulang](/miniclass/backend/assets/docker/03-build-cache-invalidated.png)

<sub>Cache invalidation: satu layer berubah, semua layer di bawahnya ikut rebuild</sub>

</div>

> Sumber gambar: Docker, [Docker build cache](https://docs.docker.com/build/cache/)

Perhatikan urutan di Dockerfile contoh:

```dockerfile
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
```

Kita sengaja menyalin `package.json` dulu, baru menjalankan `npm install`, baru menyalin seluruh kode. Alasannya:

- Kalau kamu mengubah `server.js`, layer `COPY package*.json` dan `RUN npm install` tidak berubah, jadi diambil dari cache. Build selesai dalam hitungan detik.
- Kalau kamu membalik urutannya, `COPY . .` akan berubah setiap kali kode berubah. Layer `npm install` ikut dianggap berubah dan dependency di-install ulang dari nol. Build jadi lambat.

::: tip Aturan Praktis
Urutkan instruksi dari yang **paling jarang berubah** ke yang **paling sering berubah**. Dependency jarang berubah, kode sering berubah. Maka dependency di atas, kode di bawah.
:::

Kalau ingin memaksa build tanpa cache:

```bash
docker build --no-cache -t app-sederhana:1.0 .
```

---

## `.dockerignore`

Saat kamu menjalankan `COPY . .`, Docker mengirim seluruh isi folder ke build context, termasuk hal-hal yang tidak perlu: `node_modules`, `.git`, file `.env`, folder `dist`.

Buat file `.dockerignore`:

```text
node_modules
.git
.env
npm-debug.log
Dockerfile
.dockerignore
```

Manfaatnya tiga:

1. Build lebih cepat karena konteks lebih kecil.
2. Image lebih kecil karena sampah tidak ikut masuk.
3. Rahasia seperti `.env` tidak bocor ke dalam image.

::: danger Jangan Copy `.env` ke Image
File `.env` berisi password dan API key. Kalau ikut masuk image, siapa pun yang bisa menarik image itu bisa membacanya. Masukkan `.env` ke `.dockerignore`, dan berikan konfigurasi lewat environment variable saat runtime.
:::

---

## Multi-Stage Build Singkat

Kadang proses build butuh alat yang tidak diperlukan saat aplikasi berjalan. Contohnya compiler, `devDependencies`, atau bundler.

**Multi-stage build** memungkinkan kamu memakai satu stage untuk membangun, lalu menyalin hasil akhirnya ke stage yang bersih.

```dockerfile
# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Hasil akhirnya hanya berisi aplikasi dan dependency produksi. Alat build dan source mentah tidak ikut. Image bisa jauh lebih kecil.

Kita tidak akan membahas multi-stage secara mendalam di modul ini. Cukup tahu konsepnya, karena kamu akan sering melihatnya di Dockerfile proyek nyata.

---

## Melihat Isi Image

Kalau penasaran apa saja yang masuk ke image:

```bash
docker image history app-sederhana:1.0
```

Perintah ini menampilkan daftar layer beserta ukurannya. Kamu bisa melihat layer mana yang paling besar dan layak dioptimalkan.

Untuk masuk ke image tanpa menjalankan aplikasinya:

```bash
docker run --rm -it --entrypoint sh app-sederhana:1.0
```

---

## Latihan

1. Build image dari aplikasi contoh di atas. Catat waktu build pertama.
2. Ubah teks di `server.js`, build ulang, dan catat waktunya. Bandingkan dengan build pertama. Apakah `npm install` jalan lagi?
3. Tambahkan `.dockerignore`, lalu build ulang. Bandingkan ukuran image sebelum dan sesudah.
4. Coba ganti `CMD` menjadi shell form, lalu bandingkan perilaku `docker stop`. Apakah container berhenti lebih lambat?
5. Tantangan: ubah Dockerfile supaya memakai multi-stage build dan bandingkan ukuran image akhirnya dengan `docker images`.

# Docker Compose

::: info Prasyarat Modul
Kamu sudah bisa menulis Dockerfile dan membangun image sendiri. Kalau belum, ulangi modul Dockerfile dulu.
:::

Aplikasi backend jarang berdiri sendiri. Biasanya ada database, cache, kadang message queue, kadang worker. Kalau setiap service dijalankan dengan `docker run` manual, kamu akan mengetik perintah panjang berulang-ulang, dan lupa setengah opsinya besok pagi.

**Docker Compose** menyelesaikan masalah itu. Semua service ditulis dalam satu file YAML, lalu dijalankan dengan satu perintah.

---

## Satu File, Banyak Service

Bayangkan stack berikut:

- **app**: aplikasi Node.js hasil build dari Dockerfile kita
- **db**: PostgreSQL
- **cache**: Redis

Dengan Compose, semuanya dideklarasikan dalam `docker-compose.yaml`.

```yaml
name: latihan-compose

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://admin:rahasia@db:5432/latihan
      REDIS_URL: redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: rahasia
      POSTGRES_DB: latihan
    volumes:
      - data-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d latihan"]
      interval: 5s
      timeout: 3s
      retries: 5

  cache:
    image: redis:7-alpine
    volumes:
      - data-cache:/data

volumes:
  data-db:
  data-cache:
```

Jalankan:

```bash
docker compose up -d
```

Satu perintah, tiga service hidup. Untuk mematikan semuanya:

```bash
docker compose down
```

---

## Membedah Struktur File

### `name`

```yaml
name: latihan-compose
```

Nama proyek. Compose memakai nama ini sebagai prefix untuk container, network, dan volume yang dibuat. Kalau tidak ditulis, Compose memakai nama folder.

### `services`

Ini inti file. Setiap key di bawah `services` adalah satu service.

### `build` vs `image`

```yaml
app:
  build: .
```

`build: .` berarti Compose membangun image dari Dockerfile di folder saat ini. Kalau kamu sudah punya image jadi, pakai `image`:

```yaml
db:
  image: postgres:16-alpine
```

Kamu juga bisa memakai keduanya. Compose akan build, lalu memberi tag sesuai `image`.

### `ports`

```yaml
ports:
  - "3000:3000"
```

Sama seperti `-p` di `docker run`: host:container. Service yang tidak perlu diakses dari laptop, seperti `db` dan `cache`, tidak perlu `ports` sama sekali. Mereka tetap bisa saling bicara lewat network internal Compose.

::: tip Jangan Buka Semua Port
Kalau database hanya dipakai aplikasi, jangan buka port-nya ke host. Semakin sedikit pintu terbuka, semakin kecil risiko. Kalau kamu butuh akses dari luar untuk debugging, buka sementara.
:::

### `environment` dan `env_file`

`environment` menulis variabel langsung di file. Ini mudah dibaca, tapi buruk untuk rahasia karena ikut masuk ke Git.

Alternatifnya, pakai `env_file`:

```yaml
app:
  env_file:
    - .env
```

Isi `.env`:

```text
DATABASE_URL=postgres://admin:rahasia@db:5432/latihan
REDIS_URL=redis://cache:6379
```

Pastikan `.env` masuk `.gitignore` dan `.dockerignore`.

::: warning Compose Membaca `.env` Secara Otomatis
Compose otomatis membaca file bernama `.env` di folder yang sama untuk substitusi variabel seperti `${POSTGRES_PASSWORD}`. Ini berbeda dari `env_file`, yang menyuntikkan variabel ke dalam container. Jangan bingung antara keduanya.
:::

### `volumes`

```yaml
volumes:
  - data-db:/var/lib/postgresql/data
```

Di level service, ini memasang volume ke path di dalam container. Di level paling bawah file, `volumes:` mendeklarasikan volume bernama yang dikelola Docker.

Tanpa volume, data PostgreSQL hilang setiap `docker compose down`. Kita akan membahas volume lebih dalam di pertemuan berikutnya.

### `depends_on`

```yaml
depends_on:
  db:
    condition: service_healthy
```

Mengatur urutan start. Ada dua bentuk:

- `condition: service_started`: cukup container-nya sudah dijalankan. Belum tentu siap menerima koneksi.
- `condition: service_healthy`: tunggu sampai healthcheck lolos. Ini yang kamu mau untuk database.

::: warning depends_on Bukan Jaminan Aplikasi Siap
`depends_on` mengatur urutan **container start**, bukan kesiapan aplikasi. PostgreSQL bisa sudah "started" tapi belum menerima koneksi. Karena itu `healthcheck` penting. Tetap bijak menambahkan retry logic di aplikasi, karena container bisa restart kapan saja.
:::

### `healthcheck`

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U admin -d latihan"]
  interval: 5s
  timeout: 3s
  retries: 5
```

Docker menjalankan perintah ini secara berkala. Kalau gagal terus sampai batas `retries`, container ditandai **unhealthy**. Status ini terlihat di `docker compose ps`.

---

## Perintah yang Sering Dipakai

| Perintah | Fungsi |
| :--- | :--- |
| `docker compose up -d` | Build jika perlu, lalu jalankan semua service di latar belakang |
| `docker compose up --build` | Paksa build ulang image sebelum start |
| `docker compose ps` | Lihat status service, termasuk health |
| `docker compose logs -f app` | Ikuti log satu service |
| `docker compose exec app sh` | Masuk ke shell service yang berjalan |
| `docker compose stop` | Hentikan container tanpa menghapusnya |
| `docker compose down` | Hentikan dan hapus container serta network |
| `docker compose down -v` | Sama, tapi volume ikut dihapus |
| `docker compose build` | Build semua image tanpa menjalankan |
| `docker compose restart app` | Restart satu service |

::: danger `down -v` Menghapus Data
`docker compose down -v` menghapus volume, artinya data database ikut hilang. Ini berguna saat kamu ingin mulai dari nol, tapi jangan pernah menjalankannya di server yang berisi data sungguhan.
:::

---

## Alur Kerja Sehari-hari

Yang biasa aku lakukan saat mengembangkan aplikasi:

1. Nyalakan stack: `docker compose up -d`.
2. Lihat status: `docker compose ps`. Pastikan semua `healthy`.
3. Ikuti log aplikasi: `docker compose logs -f app`.
4. Ubah kode. Kalau memakai bind mount, perubahan langsung terlihat. Kalau tidak, jalankan `docker compose up -d --build app`.
5. Masuk ke database kalau perlu: `docker compose exec db psql -U admin -d latihan`.
6. Selesai kerja, `docker compose down`. Data tetap aman di volume.

---

## Topologi yang Terbentuk

Compose membuat satu network default untuk proyekmu. Semua service di dalamnya bisa saling memanggil memakai **nama service** sebagai hostname.

<div align="center">

![Docker Compose Topology](/miniclass/backend/assets/docker/04-compose-topology.svg)

</div>

Perhatikan `DATABASE_URL` di contoh tadi:

```text
postgres://admin:rahasia@db:5432/latihan
```

Host-nya adalah `db`, bukan `localhost` dan bukan IP. Compose menyediakan DNS internal yang menerjemahkan `db` ke container PostgreSQL. Ini topik yang akan kita perluas di modul Volume dan Network.

---

## Satu Service, Banyak Environment

Kadang kamu butuh variasi antar environment, misalnya port berbeda di lokal dan CI. Compose mendukung beberapa file:

```bash
docker compose -f compose.yaml -f compose.ci.yaml up -d
```

File kedua menimpa nilai dari file pertama. Ini pola yang lebih rapi daripada menaruh semua kemungkinan di satu file.

Untuk kebutuhan yang lebih ringan, cukup pakai variabel:

```yaml
ports:
  - "${APP_PORT:-3000}:3000"
```

Artinya: pakai `APP_PORT` kalau ada, kalau tidak pakai 3000.

---

## Kesalahan Umum

| Gejala | Penyebab | Solusi |
| :--- | :--- | :--- |
| `port is already allocated` | Port host dipakai proses lain | Ganti port kiri, atau matikan prosesnya |
| App gagal connect ke db | Memakai `localhost` di dalam container | Pakai nama service, misal `db` |
| Data hilang setelah `down` | Tidak memakai volume | Tambahkan volume bernama |
| Perubahan kode tidak muncul | Image tidak di-build ulang | `docker compose up -d --build` |
| `service unhealthy` | Healthcheck gagal | Cek `docker compose logs db` |

---

## Latihan

1. Buat folder baru berisi aplikasi Node.js sederhana dan `Dockerfile` dari modul sebelumnya.
2. Tambahkan `compose.yaml` dengan service `app` dan `db` (PostgreSQL).
3. Hubungkan aplikasi ke database memakai hostname `db`, bukan `localhost`.
4. Jalankan `docker compose up -d`, lalu cek status dengan `docker compose ps`.
5. Masuk ke database dengan `docker compose exec db psql -U admin -d latihan`, lalu buat satu tabel.
6. Jalankan `docker compose down`, lalu `docker compose up -d` lagi. Apakah tabelmu masih ada? Jelaskan kenapa.
7. Tantangan: tambahkan service Redis dan hubungkan dari aplikasi.

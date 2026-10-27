# Volume dan Network

::: info Prasyarat Modul
Kamu sudah bisa menjalankan multi-service dengan Compose. Sekarang kita bahas dua hal yang paling sering bikin data hilang dan koneksi gagal.
:::

Ada dua pertanyaan yang hampir selalu muncul begitu orang mulai serius memakai Docker:

1. "Kenapa data database-ku hilang setiap container dihapus?"
2. "Kenapa aplikasiku tidak bisa connect ke database padahal jalan di laptop yang sama?"

Jawabannya ada di dua konsep: **volume** dan **network**.

---

## Container Itu Sementara

Secara default, container punya lapisan tulis di atas image. Namanya **writable layer**. Apa pun yang kamu tulis ke dalam container saat berjalan masuk ke lapisan ini.

Masalahnya, lapisan ini **hilang saat container dihapus**. Bukan saat di-stop, tapi saat di-`rm`. Jadi:

```bash
docker run -d --name db latihan-db
docker exec db psql -U admin -d latihan -c "CREATE TABLE uji (id int);"
docker rm -f db
docker run -d --name db latihan-db
```

Tabel `uji` sudah tidak ada. Container baru selalu mulai dari image yang bersih.

Untuk data yang harus bertahan, kita perlu menyimpan di luar writable layer. Ada dua cara: **volume** dan **bind mount**.

---

## Bind Mount vs Volume

<div align="center">

![Perbandingan bind mount dan named volume](/miniclass/backend/assets/docker/bind-vs-volume.png)

<sub>Bind mount menunjuk folder host. Named volume dikelola Docker.</sub>

</div>

### Bind Mount

Bind mount menautkan folder di host langsung ke path di container.

```bash
docker run -d \
  -p 3000:3000 \
  -v "$(pwd)":/app \
  -v /app/node_modules \
  --name app-dev \
  app-sederhana:1.0
```

Penjelasannya:

- `-v "$(pwd)":/app` menautkan folder proyek di laptop ke `/app` di container.
- `-v /app/node_modules` adalah **anonymous volume**. Tujuannya menutupi `node_modules` di dalam container supaya tidak tertimpa folder `node_modules` dari laptop.

Kenapa perlu trik kedua? Karena `node_modules` di laptopmu dibangun untuk sistem operasimu. Kalau container Linux memakai folder itu, bisa ada binary yang tidak cocok. Anonymous volume membuat container tetap memakai `node_modules` hasil build di dalam image.

Bind mount cocok untuk:

- Development, supaya perubahan kode langsung terlihat tanpa build ulang.
- Memberi file konfigurasi dari host ke container.
- Berbagi hasil build ke host.

Kekurangannya: performa bisa lambat di macOS dan Windows, karena file harus melewati lapisan virtualisasi. Di Linux, bind mount sangat cepat.

### Named Volume

Named volume dikelola sepenuhnya oleh Docker. Kamu tidak perlu tahu di mana foldernya berada di host.

```bash
docker run -d \
  -v data-db:/var/lib/postgresql/data \
  --name db \
  postgres:16-alpine
```

Di sini `data-db` adalah nama volume. Docker menyimpannya di area khusus, biasanya di bawah `/var/lib/docker/volumes/`.

Named volume cocok untuk:

- Data database.
- Data yang perlu bertahan antar container.
- Berbagi data antar container tanpa peduli path host.

### Perbandingan

| Aspek | Bind Mount | Named Volume |
| :--- | :--- | :--- |
| Lokasi data | Folder pilihanmu di host | Dikelola Docker |
| Perintah | `-v /path/host:/path/container` | `-v nama:/path/container` |
| Portabilitas | Tergantung path host | Portabel antar mesin |
| Cocok untuk | Development, config | Data persisten, database |
| Performa macOS/Windows | Lebih lambat | Lebih cepat |

::: tip Aturan Sederhana
Kalau kamu ingin **mengubah** isi dari host, pakai bind mount. Kalau kamu ingin **menyimpan** data yang dikelola container, pakai named volume.
:::

### Mengelola Volume

```bash
docker volume ls
docker volume inspect data-db
docker volume rm data-db
```

Volume tidak bisa dihapus kalau masih dipakai container. Sama seperti image.

Untuk melihat volume yang tidak terpakai:

```bash
docker volume prune
```

::: danger Hati-hati dengan Prune
`docker volume prune` menghapus volume yang tidak dipakai container mana pun. Kalau kamu punya volume berisi data penting dan container-nya sedang mati, volume itu bisa ikut terhapus. Periksa dengan `docker volume ls` sebelum menjalankan.
:::

---

## Network: Kenapa `localhost` Tidak Bekerja

Ini kesalahan nomor satu pemula Docker.

Di laptopmu, aplikasi dan database berjalan di mesin yang sama. Jadi `localhost:5432` masuk akal.

Di dalam container, `localhost` berarti **container itu sendiri**. Bukan laptopmu, bukan container lain. Kalau aplikasi di container `app` mencoba connect ke `localhost:5432`, dia mencari PostgreSQL di dalam container `app`, yang tentu saja tidak ada.

Solusinya: pakai nama service atau nama container.

```text
postgres://admin:rahasia@db:5432/latihan
```

Di sini `db` diterjemahkan oleh DNS internal Docker ke IP container database.

### Default Bridge Network

Saat kamu menjalankan container tanpa `--network`, Docker menaruhnya di network default bernama `bridge`. Di network ini, container bisa saling bicara lewat IP, tapi **tidak lewat nama**. Ini alasan kenapa `docker run` manual sering gagal connect.

### Custom Bridge Network

Kalau kamu membuat network sendiri, Docker mengaktifkan DNS internal. Container di network yang sama bisa saling memanggil dengan nama.

```bash
docker network create jaringan-app
```

Lalu jalankan container di network itu:

```bash
docker run -d --name db --network jaringan-app postgres:16-alpine
docker run -d --name app --network jaringan-app app-sederhana:1.0
```

Sekarang dari dalam `app`, hostname `db` bisa dipakai.

Compose melakukan ini otomatis. Itu sebabnya contoh Compose di pertemuan sebelumnya langsung bekerja tanpa konfigurasi network tambahan.

### Melihat Network

```bash
docker network ls
docker network inspect jaringan-app
```

Output `inspect` menunjukkan container mana saja yang terhubung dan IP masing-masing.

---

## Port Publishing vs Network Internal

Dua hal ini sering tertukar.

- **Port publishing** (`-p 3000:3000`) membuka pintu dari host ke container. Ini yang membuat browser di laptopmu bisa mengakses aplikasi.
- **Network internal** memungkinkan container saling bicara tanpa membuka port ke host.

Database tidak perlu `-p`. Aplikasi tetap bisa connect lewat network internal. Kalau kamu membuka port database ke host, itu hanya untuk debugging, dan sebaiknya ditutup lagi setelah selesai.

::: warning Jangan Buka Database ke Publik
Membuka port database ke `0.0.0.0` di server produksi adalah undangan untuk diserang. Cukup biarkan database di network internal, dan akses lewat aplikasi atau VPN.
:::

---

## Studi Kasus: Data Hilang Setelah Compose Down

Misalkan kamu punya `compose.yaml` seperti ini:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: rahasia
```

Kamu membuat data, lalu menjalankan `docker compose down`. Setelah `up` lagi, data hilang.

Penyebabnya: tidak ada volume. Data ditulis ke writable layer container, dan container dihapus oleh `down`.

Perbaikannya:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: rahasia
    volumes:
      - data-db:/var/lib/postgresql/data

volumes:
  data-db:
```

Sekarang data bertahan, bahkan saat container diganti.

---

## Latihan

1. Jalankan container PostgreSQL tanpa volume. Buat satu tabel, hapus container, lalu jalankan lagi. Buktikan datanya hilang.
2. Ulangi dengan named volume. Buktikan datanya bertahan.
3. Jalankan aplikasi Node.js dengan bind mount ke folder proyek. Ubah kode, dan pastikan perubahan langsung terlihat tanpa build ulang.
4. Buat custom network, jalankan dua container di dalamnya, dan buktikan mereka bisa saling ping memakai nama.
5. Tantangan: dari dalam container `app`, coba `ping db` dan `curl http://db:5432`. Jelaskan hasilnya.

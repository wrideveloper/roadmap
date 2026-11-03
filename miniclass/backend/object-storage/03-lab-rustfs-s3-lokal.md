# Lab: RustFS sebagai S3 Lokal

::: info Prasyarat Modul
Kamu sudah paham model data dan bentuk request S3. Sekarang kita siapkan server latihan. Halaman ini murni operasional: tidak ada konsep baru selain cara menyalakan alat.
:::

Untuk mempraktikkan S3 API, kita butuh server yang bicara protokol itu. Kita memakai **RustFS**, object storage open-source yang kompatibel S3, berjalan sebagai satu container.

Yang kita pelajari adalah S3 API. RustFS hanya pengganti lokal supaya kamu tidak perlu kartu kredit AWS untuk belajar.

---

## File Compose

Buat folder `kelas-object-storage`, lalu isi `compose.yaml`:

```yaml
name: kelas-object-storage

services:
  rustfs:
    image: rustfs/rustfs:1.0.4
    container_name: rustfs-server
    ports:
      - "9000:9000"   # S3 API
      - "9001:9001"   # Web Console
    environment:
      - RUSTFS_ADDRESS=:9000
      - RUSTFS_CONSOLE_ADDRESS=:9001
      - RUSTFS_CONSOLE_ENABLE=true
      - RUSTFS_ACCESS_KEY=kelasadmin
      - RUSTFS_SECRET_KEY=kelasrahasia123
    volumes:
      - rustfs-data:/data
    restart: unless-stopped

volumes:
  rustfs-data:
```

Jalankan:

```bash
docker compose up -d
docker compose ps
```

Dua port yang perlu kamu ingat:

| Port | Isi | Dibuka di browser? |
| :--- | :--- | :--- |
| `9000` | S3 API, dipakai `curl`, CLI, dan aplikasi | Tidak perlu |
| `9001` | Web Console, dipakai manusia | `http://localhost:9001` |

::: warning Pin Versinya
Kita memakai `rustfs/rustfs:1.0.4`, bukan `latest`. RustFS masih 1.x muda dan rilis tiap minggu. Dengan versi yang di-pin, Compose-mu hari ini dan tiga bulan lagi menghasilkan server yang sama.
:::

---

## Cek Kesehatan

```bash
curl --fail http://localhost:9000/health
docker compose logs rustfs
```

`docker compose ps` harus menunjukkan status `running`. Kalau `curl` gagal, baca log dulu sebelum menebak.

---

## Jebakan Pertama: UID 10001

RustFS di dalam container berjalan sebagai user `rustfs` dengan UID `10001`, bukan root.

Kalau kamu memakai **named volume** seperti contoh di atas, tidak ada masalah: Docker yang mengatur kepemilikan folder.

Tapi kalau kamu memakai **bind mount**:

```yaml
volumes:
  - ./data:/data
```

Container gagal start dengan permission denied, karena folder `./data` milik user laptopmu (biasanya UID 1000), sedangkan proses di container berjalan sebagai UID 10001.

Perbaikannya:

```bash
mkdir -p data logs
sudo chown -R 10001:10001 data logs
```

::: tip Ini Materi Docker yang Hidup
Ini konsep yang sama dengan modul Volume dan Network: container dan host bisa punya user berbeda, dan bind mount tidak menerjemahkan kepemilikan otomatis. Untuk kelas, pakai named volume saja agar lebih sedikit yang bisa salah.
:::

---

## Buka Console

Buka `http://localhost:9001` dan login dengan:

- Access Key: `kelasadmin`
- Secret Key: `kelasrahasia123`

Kredensial ini bukan password console terpisah, melainkan **S3 access key dan secret key** yang sama yang nanti dipakai `curl`, CLI, dan SDK.

::: danger Kredensial Contoh Bukan untuk Produksi
Di server sungguhan, generate secret yang panjang (`openssl rand -base64 24`), simpan di `.env` yang tidak ikut Git, dan jangan pernah memakai default `rustfsadmin`/`rustfsadmin`.
:::

Di console kamu akan melihat menu Buckets, Users, dan Policies. Kita akan lebih banyak bekerja lewat API dan CLI, tapi console berguna untuk memeriksa hasil.

---

## Bucket Pertama

Bucket adalah wadah tertinggi. Buat satu lewat console:

1. Buka menu **Buckets**.
2. Klik **Create Bucket**.
3. Isi nama `materi-kelas`.
4. Klik **Create**.

Aturan nama bucket (warisan S3): huruf kecil, angka, titik, dan strip; 3 sampai 63 karakter; tidak diawali atau diakhiri strip atau titik.

Upload satu file lewat console untuk memastikan semuanya hidup. Kalau file muncul di daftar, lab-mu siap.

---

## Data Tersimpan di Mana?

Semua object masuk ke named volume `rustfs-data`. Buktikan:

```bash
docker compose down
docker compose up -d
```

File yang tadi kamu upload masih ada. Container boleh mati dan diganti, data tetap tinggal.

Kalau penasaran lokasi mentahnya:

```bash
docker volume inspect kelas-object-storage_rustfs-data
```

Jangan mengubah isi folder itu manual. Formatnya internal RustFS.

---

## Cek Kompatibilitas S3

RustFS mengklaim kompatibel S3, tapi tidak semua fitur S3 ada di setiap versi. Supaya aman, modul ini hanya memakai operasi S3 core yang pasti didukung:

`CreateBucket`, `ListBuckets`, `HeadBucket`, `DeleteBucket`, `PutObject`, `GetObject`, `HeadObject`, `DeleteObject`, `ListObjectsV2`, multipart upload, dan presigned URL.

Kalau nanti kamu menemukan operasi yang bekerja di AWS tapi gagal di RustFS, itu perbedaan implementasi, bukan kesalahan kodemu. Catat, lalu lanjutkan.

---

## Latihan

1. Jalankan RustFS dengan Compose di atas dan pastikan statusnya `running`.
2. Buka console, login, dan buat bucket `materi-kelas`.
3. Upload tiga file lewat console, lalu download salah satunya.
4. Matikan stack, nyalakan lagi, dan buktikan file masih ada.
5. Tantangan: ganti named volume menjadi bind mount `./data:/data`. Amati error-nya, perbaiki dengan `chown 10001:10001`, lalu jelaskan kenapa itu perlu.

---

## Referensi

- [RustFS: Install with Docker](https://docs.rustfs.com/en/installation/container/docker)
- [RustFS Documentation](https://docs.rustfs.com/en)
- [Amazon S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)

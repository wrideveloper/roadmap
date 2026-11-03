# Model Data dan Request S3

::: info Prasyarat Modul
Kamu sudah paham kenapa object storage ada. Di pertemuan ini kita belum menyalakan server apa pun. Kita bedah dulu bentuk datanya dan bentuk request-nya, supaya semua perintah di pertemuan berikutnya punya tempat berpijak.
:::

S3 itu bukan database dan bukan file system. Dia adalah **API HTTP untuk menyimpan dan mengambil object**. Kalau kamu paham tiga hal ini, sisa modul akan terasa mudah:

1. Bagaimana data disusun (bucket, key, object).
2. Bagaimana request ditulis (method, path, header).
3. Bagaimana jawabannya dibaca (status code, XML, ETag).

---

## Tiga Tingkat Resource

S3 hanya punya tiga tingkat.

| Tingkat | Arti | Contoh |
| :--- | :--- | :--- |
| **Service** | Server S3 itu sendiri | `http://localhost:9000` |
| **Bucket** | Wadah tertinggi, nama unik | `materi-kelas` |
| **Object** | Satu file beserta metadata, diakses lewat key | `materi-kelas/foto/user-123.jpg` |

Perhatikan: tidak ada tingkat "folder". `foto/user-123.jpg` adalah **satu key utuh**. Garis miring di dalamnya hanya karakter biasa yang kebetulan ditampilkan seperti folder oleh konsol.

### Aturan nama bucket

- 3 sampai 63 karakter.
- Huruf kecil, angka, titik, dan strip.
- Tidak boleh diawali atau diakhiri strip atau titik.
- Harus unik dalam satu server atau region.

### Aturan key

- UTF-8, maksimal 1024 byte.
- Boleh mengandung hampir semua karakter, termasuk spasi (nanti di-encode di URL).
- Tidak boleh kosong.
- Case-sensitive: `Foto.jpg` dan `foto.jpg` adalah dua object berbeda.

::: tip Prefix dan Delimiter
Karena tidak ada folder, S3 menyediakan ilusi folder lewat `prefix` dan `delimiter`. Kalau kamu minta `prefix=foto/` dan `delimiter=/`, S3 akan mengelompokkan hasil berdasarkan satu tingkat setelah prefix. Ini yang ditampilkan konsol sebagai folder.
:::

---

## Alamat Server: Endpoint

Setiap server S3 punya endpoint, yaitu alamat dasar API-nya.

| Lingkungan | Contoh endpoint |
| :--- | :--- |
| AWS S3 (region Jakarta) | `https://s3.ap-southeast-3.amazonaws.com` |
| AWS S3 (region Singapura) | `https://s3.ap-southeast-1.amazonaws.com` |
| RustFS lokal | `http://localhost:9000` |
| Cloudflare R2 | `https://<account-id>.r2.cloudflarestorage.com` |

`region` adalah lokasi fisik data. Di RustFS lokal, region tidak punya arti, tapi SDK tetap meminta nilainya. Isi `us-east-1` sebagai konvensi.

---

## Dua Gaya Alamat: Path vs Virtual-Hosted

Ada dua cara menulis alamat object:

| Gaya | Bentuk | Kapan dipakai |
| :--- | :--- | :--- |
| **Path style** | `http://localhost:9000/materi-kelas/foto.jpg` | Server lokal, IP address, domain tanpa wildcard DNS |
| **Virtual-hosted style** | `http://materi-kelas.localhost:9000/foto.jpg` | AWS S3, domain dengan wildcard DNS |

Di AWS, gaya kedua yang default: nama bucket jadi subdomain. Di laptop, tidak ada DNS yang bisa menerjemahkan `materi-kelas.localhost`, jadi kita selalu memakai path style.

Karena itu `forcePathStyle: true` diperlukan di modul ini. Nilai ini bukan setelan RustFS, melainkan konsekuensi dari tidak adanya wildcard DNS di lokal.

::: warning Ini Sumber Error Nomor Satu di Lokal
SDK modern default ke virtual-hosted style. Kalau kamu lupa memaksa path style, aplikasi akan gagal connect dengan error DNS seperti `ENOTFOUND materi-kelas.localhost`. Server-nya sehat, hanya alamatnya yang tidak bisa diterjemahkan.
:::

---

## Object Itu Data Plus Metadata

Satu object membawa dua jenis metadata.

### System metadata

Diatur oleh S3 atau dikirim sebagai header standar:

| Header | Arti |
| :--- | :--- |
| `Content-Type` | Tipe file, misal `image/jpeg` |
| `Content-Length` | Ukuran dalam byte |
| `ETag` | Sidik jari isi object (biasanya MD5, tapi tidak selalu) |
| `Last-Modified` | Waktu terakhir diubah |

### User metadata

Metadata buatanmu, selalu diawali `x-amz-meta-`:

```text
x-amz-meta-uploader: budi
x-amz-meta-kategori: tugas-akhir
```

User metadata disimpan bersama object dan dikembalikan saat kamu `HEAD` atau `GET`. Berguna untuk informasi kecil yang tidak layak punya tabel database sendiri.

::: warning ETag Bukan Selalu MD5
Untuk upload biasa, ETag terlihat seperti MD5. Tapi untuk upload multipart, ETag adalah hash dari gabungan hash tiap part, ditambah akhiran `-N`. Jangan pernah memakai ETag sebagai bukti integritas tanpa membaca cara pembentukannya.
:::

---

## Menyimpan Referensi Object di Database

Object tinggal di storage, tapi aplikasi tetap butuh tempat untuk mencatat object mana milik siapa. Tempat itu database, dan yang disimpan adalah **referensi**, bukan isi file.

Di bagian ini banyak orang bingung, jadi kita luruskan dulu. Kata "BLOB" sering dipakai untuk dua hal yang sangat berbeda:

| Yang disimpan | Isi kolom | Ukuran | Boleh? |
| :--- | :--- | :--- | :--- |
| Isi file | Byte foto, PDF, video | KB sampai GB | Tidak |
| Identitas object | String key, misal `profil/2026/11/9f3a.jpg` | 50 sampai 200 byte | Ya |

Menyimpan isi file di database membuat backup membengkak, query melambat, replikasi berat, dan biaya storage naik. Menyimpan identitasnya justru pola yang benar.

Satu hal yang perlu kamu tahu: S3 tidak memberikan ID otomatis untuk object. Tidak ada `object_id` yang dibuat server. Yang menjadi identitas adalah **key yang kamu tentukan sendiri**. `ETag` bukan ID, karena nilainya berubah kalau object ditimpa.

### Kolom key harus TEXT, bukan BLOB

Kalau kamu memakai kolom BLOB untuk menyimpan key, secara teknis bisa, tapi tipe datanya salah. Key adalah teks, bukan biner. Akibatnya:

- Perbandingan dan pengurutan jadi aneh, karena database membandingkan sebagai byte.
- Index pada kolom BLOB umumnya terbatas panjangnya (di MySQL, index BLOB butuh prefix length).
- ORM dan driver mengembalikan `Buffer`, bukan `string`, jadi kamu harus konversi manual di setiap query.
- Query `WHERE object_key = ?` tidak bisa memakai index penuh dengan nyaman.

Gunakan `VARCHAR` atau `TEXT`. Di PostgreSQL, `TEXT` tidak punya batas praktis dan tetap bisa di-index.

### Skema tabel files

```sql
CREATE TABLE files (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket          TEXT NOT NULL,
  object_key      TEXT NOT NULL,
  original_name   TEXT NOT NULL,
  content_type    TEXT NOT NULL,
  size_bytes      BIGINT NOT NULL,
  checksum_sha256 TEXT,
  owner_type      TEXT NOT NULL,
  owner_id        UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE (bucket, object_key)
);

CREATE INDEX files_owner_idx ON files (owner_type, owner_id);
```

Penjelasan tiap kolom:

| Kolom | Fungsi | Kenapa perlu |
| :--- | :--- | :--- |
| `id` | ID internal baris | Dipakai aplikasi untuk merujuk file, misal `users.avatar_file_id` |
| `bucket` | Nama bucket | Disimpan terpisah dari key agar pindah bucket tidak perlu mengubah key |
| `object_key` | Key object di S3 | Ini identitas file yang sebenarnya |
| `original_name` | Nama asli dari user | Untuk ditampilkan dan dipakai saat download |
| `content_type` | MIME type | Untuk header response dan validasi |
| `size_bytes` | Ukuran file | Untuk kuota, validasi, dan laporan |
| `checksum_sha256` | Hash isi file | Untuk deteksi duplikat dan verifikasi integritas |
| `owner_type` | Jenis pemilik, misal `user` atau `post` | Untuk relasi polimorfik |
| `owner_id` | ID pemilik | Untuk query "semua file milik user ini" |
| `created_at` | Waktu upload | Audit dan pengurutan |
| `deleted_at` | Soft delete | Supaya riwayat tidak langsung hilang |

`UNIQUE (bucket, object_key)` mencegah dua baris menunjuk ke object yang sama. Index `(owner_type, owner_id)` mempercepat query per pemilik.

::: tip Catatan Database
`gen_random_uuid()` tersedia bawaan di PostgreSQL 13 ke atas. Di versi lama, aktifkan ekstensi `pgcrypto` lebih dulu.

Di MySQL, gunakan `CHAR(36)` untuk kolom UUID dengan default `UUID()`, dan `DATETIME` untuk kolom waktu.
:::

Pola `owner_type` dan `owner_id` disebut relasi polimorfik. Fleksibel karena satu tabel bisa menampung file milik user, post, atau produk. Konsekuensinya, database tidak bisa menjaga foreign key-nya. Kalau kamu butuh integritas ketat, tambahkan kolom khusus seperti `users.avatar_file_id` yang menunjuk ke `files.id`.

### Desain key

Key sebaiknya dibuat oleh backend, bukan dari nama file user:

```text
profil/2026/11/9f3a2b1c-4d5e-7f80-9a1b-2c3d4e5f6a7b.jpg
```

Alasannya:

- **Nama asli bisa bentrok.** Dua user upload `foto.jpg`, yang satu menimpa yang lain.
- **Nama asli bisa mengandung PII.** Nama lengkap atau NIM tidak perlu muncul di URL.
- **Karakter aneh harus di-encode.** Spasi, tanda kutip, dan karakter non-ASCII menyulitkan URL.
- **UUID mencegah penebakan.** Orang tidak bisa menebak key file user lain.
- **Prefix tanggal membantu operasi.** Lifecycle rule dan audit jadi lebih mudah.

`original_name` tetap disimpan di database supaya user melihat nama aslinya saat download.

### Yang tidak boleh disimpan di database

| Data | Alasan |
| :--- | :--- |
| Presigned URL | Kedaluwarsa dalam menit, jadi cepat basi |
| Public URL lengkap | Endpoint bisa berubah, misal dari RustFS ke S3 |
| Isi file dalam base64 | Membengkak 33 persen dan memperlambat query |
| Access key atau secret key | Rahasia tidak boleh ada di baris data biasa |

URL dibuat saat dibutuhkan, dari `bucket` + `object_key` + endpoint yang ada di konfigurasi. Dengan begitu, pindah penyedia cukup mengubah konfigurasi, bukan isi database.

### Alur upload dan pencatatan

1. Frontend minta izin upload ke backend.
2. Backend membuat key, misal `profil/2026/11/<uuid>.jpg`, lalu mengembalikan presigned PUT (dibahas di pertemuan 6).
3. Frontend upload langsung ke object storage.
4. Frontend memberi tahu backend bahwa upload selesai, dengan menyertakan key.
5. Backend memastikan object itu benar ada dengan `HeadObject`, lalu menyimpan baris di tabel `files`.
6. Saat file dibutuhkan, backend membaca baris `files`, memeriksa hak akses lewat `owner_id`, lalu membuat presigned GET.

Perhatikan urutannya: **baris database dibuat setelah object berhasil diunggah**. Kalau dibalik, kamu bisa punya baris `files` yang menunjuk ke object yang tidak pernah ada.

### Menghapus file

Database dan object storage tidak bisa berada dalam satu transaksi. Jadi penghapusan dilakukan bertahap:

1. Tandai `deleted_at` (soft delete). File langsung tidak ditampilkan.
2. Hapus object dari storage.
3. Hapus baris, atau biarkan sebagai tombstone untuk audit.

Kalau langkah 2 gagal, jangan hapus barisnya. Simpan statusnya, lalu jalankan job pembersih yang mencoba ulang. Ini lebih aman daripada menghapus baris lebih dulu dan meninggalkan object yatim.

### Kapan BLOB masih masuk akal

Ada pengecualian, tapi sempit:

- File sangat kecil, misalnya ikon di bawah 100 KB, dan harus selalu konsisten dengan baris database.
- Data yang memang biner dan melekat pada baris, misalnya hash, signature, atau potongan terenkripsi.
- Database lokal untuk prototipe, di mana kesederhanaan lebih penting daripada skala.

Di luar itu, simpan isi file di object storage dan simpan referensinya di database.

---

## S3 Itu HTTP Biasa

Inti yang membuat S3 mudah dipelajari adalah semua operasi berupa request HTTP dengan method dan path tertentu.

| Operasi | Method | Path |
| :--- | :--- | :--- |
| `ListBuckets` | `GET` | `/` |
| `CreateBucket` | `PUT` | `/{bucket}` |
| `HeadBucket` | `HEAD` | `/{bucket}` |
| `DeleteBucket` | `DELETE` | `/{bucket}` |
| `ListObjectsV2` | `GET` | `/{bucket}?list-type=2&prefix=...` |
| `PutObject` | `PUT` | `/{bucket}/{key}` |
| `GetObject` | `GET` | `/{bucket}/{key}` |
| `HeadObject` | `HEAD` | `/{bucket}/{key}` |
| `DeleteObject` | `DELETE` | `/{bucket}/{key}` |
| `CopyObject` | `PUT` | `/{bucket}/{key}` dengan header `x-amz-copy-source` |

Perhatikan pola yang konsisten:

- Bucket dan object memakai path yang sama.
- Bedanya hanya ada tidaknya key setelah bucket.
- Method HTTP menentukan aksinya: `PUT` menulis, `GET` membaca, `DELETE` menghapus, `HEAD` mengambil metadata saja.

Tidak ada endpoint `/upload` atau `/download`; semuanya resource-oriented. Ini alasan S3 terasa konsisten setelah kamu terbiasa.

---

## Anatomi Request

Request S3 yang sudah ditandatangani kira-kira seperti ini:

```http
PUT /materi-kelas/catatan.txt HTTP/1.1
Host: localhost:9000
Content-Type: text/plain
Content-Length: 10
x-amz-meta-uploader: budi
x-amz-content-sha256: 09b50b2f685e7a783eeee02d8070e670d48af118a4b00f7bfebe9f8f0e5d3d52
x-amz-date: 20261103T090000Z
Authorization: AWS4-HMAC-SHA256 Credential=kelasadmin/20261103/us-east-1/s3/aws4_request, SignedHeaders=content-type;host;x-amz-content-sha256;x-amz-date;x-amz-meta-uploader, Signature=5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7

halo dunia
```

Baris kosong memisahkan header dari body. `halo dunia` adalah isi file `catatan.txt`, yaitu 10 byte. `x-amz-content-sha256` harus berisi hash SHA-256 dari byte body yang sama, bukan hash dari teks lain.

::: info Nilai Signature Hanya Ilustrasi
Nilai `Signature` di atas tidak bisa diverifikasi tanpa canonical request lengkap. Yang perlu kamu pastikan konsisten adalah `Content-Length` dan `x-amz-content-sha256` dengan body yang dikirim.
:::

Yang perlu kamu kenali:

| Bagian | Fungsi |
| :--- | :--- |
| `Host` | Endpoint server |
| `x-amz-date` | Waktu request, format ISO 8601 dasar |
| `x-amz-content-sha256` | Hash isi body, dipakai untuk verifikasi integritas |
| `x-amz-meta-*` | Metadata buatanmu |
| `Authorization` | Bukti bahwa request ini sah |

---

## Gambaran SigV4

S3 tidak memakai password di header. Dia memakai **Signature Version 4 (SigV4)**, skema tanda tangan berbasis HMAC.

Alurnya secara konsep:

1. Susun **canonical request**: method, path, query, header terpilih, dan hash body.
2. Buat **string to sign**: algoritma, waktu, scope (tanggal/region/service), dan hash canonical request.
3. Turunkan **signing key** berantai dari secret key: `HMAC(secret, tanggal)` lalu `HMAC(hasil, region)` lalu `HMAC(hasil, s3)` lalu `HMAC(hasil, aws4_request)`.
4. Tanda tangani string to sign dengan signing key itu.
5. Kirim hasilnya di header `Authorization`.

Kamu **tidak akan** menghitung ini dengan tangan di modul ini. Tugas itu diserahkan ke `curl`, AWS CLI, atau SDK. Yang perlu kamu pahami hanya tiga hal:

- Tanda tangan mengikat method, path, dan header tertentu. Ubah satu saja, tanda tangan batal.
- Secret key tidak pernah dikirim. Yang dikirim hanya turunannya.
- Jam sistem harus benar. Selisih lebih dari 15 menit menghasilkan `RequestTimeTooSkewed`.

Di pertemuan 6 kita akan melihat variasi lain, yaitu tanda tangan yang dipindah dari header ke query string. Variasi ini disebut presigned URL.

---

## Anatomi Response

Response selalu membawa status code HTTP. Yang sering kamu temui:

| Status | Arti | Contoh penyebab |
| :--- | :--- | :--- |
| `200 OK` | Berhasil | `GetObject`, `PutObject` |
| `204 No Content` | Berhasil, tanpa body | `DeleteObject` |
| `206 Partial Content` | Sebagian isi object | Request dengan header `Range` |
| `304 Not Modified` | Belum berubah | Request dengan `If-None-Match` yang cocok |
| `400 Bad Request` | Request tidak valid | Header salah, XML rusak |
| `403 Forbidden` | Tidak punya izin | Kredensial salah, atau bucket privat |
| `404 Not Found` | Bucket atau key tidak ada | `NoSuchKey`, `NoSuchBucket` |
| `409 Conflict` | Bentrok state | `BucketAlreadyExists`, `BucketNotEmpty` |
| `412 Precondition Failed` | Syarat tidak terpenuhi | `If-None-Match` gagal |
| `416 Range Not Satisfiable` | Range di luar ukuran | `Range: bytes=999999-` |
| `500 Internal Error` | Server bermasalah | Bug atau disk penuh |
| `503 Slow Down` | Terlalu banyak request | Rate limit |

Saat error, body-nya XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Error>
  <Code>NoSuchKey</Code>
  <Message>The specified key does not exist.</Message>
  <Resource>/materi-kelas/catatan-hilang.txt</Resource>
  <RequestId>4442587FB7D0A2F9</RequestId>
</Error>
```

`Code` adalah yang kamu cek di kode aplikasi. `Message` untuk manusia. `RequestId` untuk mencari log di sisi server.

::: danger 404 Bisa Muncul Sebagai 403
Kalau pemanggil tidak punya izin `s3:ListBucket`, S3 mengembalikan `403 AccessDenied` untuk key yang tidak ada, bukan `404`. Tujuannya agar orang tidak bisa menebak object mana yang ada.

Jadi kalau kamu melihat 403 padahal kredensial terasa benar, cek dua kemungkinan: kredensialnya memang salah, atau object-nya tidak ada dan kamu tidak punya izin list.
:::

---

## Yang Tidak Akan Kita Bahas

Supaya jelas batasnya: modul ini tidak membahas ACL granular, bucket policy tingkat lanjut, replikasi lintas region, Object Lock, lifecycle, versioning, atau storage class. Itu semua topik lanjutan.

Yang kita bahas adalah inti yang dipakai 90 persen aplikasi: simpan, ambil, list, hapus, metadata, dan akses sementara.

---

## Latihan

1. Gambar ulang tiga tingkat resource S3 dan letakkan satu object contoh di dalamnya.
2. Tulis lima operasi S3 beserta method HTTP dan path-nya, tanpa melihat tabel.
3. Jelaskan kenapa `materi-kelas.localhost` gagal di laptop, dan kenapa path style menyelamatkannya.
4. Bedakan system metadata dan user metadata. Beri satu contoh pemakaian user metadata yang masuk akal.
5. Tantangan: jelaskan kenapa mengubah satu header saja bisa membuat tanda tangan SigV4 tidak sah.

---

## Referensi

- [Amazon S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
- [S3 Error Responses](https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html)
- [Authenticating Requests (SigV4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)

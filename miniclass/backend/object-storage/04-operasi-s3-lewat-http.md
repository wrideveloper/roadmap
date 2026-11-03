# Operasi S3 lewat HTTP

::: info Prasyarat Modul
Lab RustFS sudah berjalan dan bucket `materi-kelas` sudah ada. Kalau belum, selesaikan pertemuan sebelumnya.
:::

Di pertemuan ini kita memakai `curl` dan HTTP tanpa SDK atau konsol, supaya kamu bisa melihat request dan response yang sebenarnya dikirim aplikasi.

Setelah halaman ini, pesan error S3 tidak lagi terasa seperti teka-teki.

---

## Siapkan curl

Kita butuh `curl` versi 7.75 atau lebih baru, karena hanya versi itu yang bisa menandatangani SigV4 sendiri:

```bash
curl --version | head -1
```

Kalau versimu lebih lama:

```bash
# macOS
brew install curl

# Ubuntu/Debian
sudo apt install curl
```

Lalu siapkan tiga variabel:

```bash
export S3_ENDPOINT=http://localhost:9000
export S3_ACCESS_KEY=kelasadmin
export S3_SECRET_KEY=kelasrahasia123
export SIGV4="aws:amz:us-east-1:s3"
```

Mulai sekarang, semua perintah cukup menulis:

```bash
curl --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" ...
```

`--aws-sigv4` yang menghitung canonical request dan HMAC. `--user` menyediakan access key dan secret key. Kamu tidak perlu menghitung apa pun.

::: tip Lihat Tanda Tangannya
Tambahkan `-v` pada perintah mana pun. Kamu akan melihat header `Authorization: AWS4-HMAC-SHA256 Credential=...` yang dikirim ke server. Header itu adalah SigV4 yang kita bahas di pertemuan 2, dan curl yang menghitungnya.
:::

---

## ListBuckets

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  "$S3_ENDPOINT/" -i
```

Response-nya XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ListAllMyBucketsResult>
  <Buckets>
    <Bucket>
      <Name>materi-kelas</Name>
      <CreationDate>2026-11-03T09:00:00.000Z</CreationDate>
    </Bucket>
  </Buckets>
</ListAllMyBucketsResult>
```

Perhatikan tiga hal:

- `GET /` artinya "tampilkan semua bucket".
- Response selalu XML untuk operasi kontrol.
- Status `200 OK` ada di baris pertama response header (`-i` menampilkannya).

---

## CreateBucket dan HeadBucket

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  -X PUT "$S3_ENDPOINT/latihan-http" -i
```

`PUT /latihan-http` membuat bucket. Body response kosong, status `200 OK`.

Cek keberadaannya tanpa mengambil isi:

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  -I "$S3_ENDPOINT/latihan-http"
```

`HEAD` hanya mengembalikan header. Cocok untuk health check cepat. Kalau bucket tidak ada, statusnya `404`.

---

## PutObject

Siapkan file:

```bash
printf 'halo dari curl\n' > hello.txt
```

Upload:

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  -X PUT \
  -H "Content-Type: text/plain" \
  --data-binary @hello.txt \
  "$S3_ENDPOINT/materi-kelas/hello.txt" -i
```

Yang perlu diperhatikan:

- `--data-binary @hello.txt` mengirim isi file apa adanya, tanpa mengubah baris baru.
- `Content-Type` menentukan bagaimana file nanti disajikan. Tanpa ini, `curl` memakai `application/x-www-form-urlencoded`, dan browser bisa salah menampilkan file.
- Response membawa header `ETag`, sidik jari isi object.

Kalau berhasil, status `200 OK` dan body kosong.

---

## GetObject dan HeadObject

Ambil isinya:

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  "$S3_ENDPOINT/materi-kelas/hello.txt"
```

Simpan ke file:

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  "$S3_ENDPOINT/materi-kelas/hello.txt" -o hasil.txt
```

Cek metadata tanpa mengunduh isinya:

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  -I "$S3_ENDPOINT/materi-kelas/hello.txt"
```

Kamu akan melihat `Content-Type: text/plain`, `Content-Length`, `ETag`, dan `Last-Modified`.

---

## User Metadata

Metadata dikirim sebagai header saat upload:

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  -X PUT \
  -H "Content-Type: text/plain" \
  -H "x-amz-meta-uploader: budi" \
  -H "x-amz-meta-kategori: tugas-akhir" \
  --data-binary @hello.txt \
  "$S3_ENDPOINT/materi-kelas/hello.txt"
```

Lalu baca lagi dengan `HEAD`. Header `x-amz-meta-uploader` dan `x-amz-meta-kategori` akan muncul kembali.

::: warning Metadata Bukan Tempat Data Besar
User metadata dibatasi sekitar 2 KB total untuk semua header `x-amz-meta-*`. Untuk data yang lebih besar, simpan di database dan simpan key object-nya saja di sana.
:::

---

## ListObjectsV2

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  "$S3_ENDPOINT/materi-kelas?list-type=2" -i
```

Response:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult>
  <Name>materi-kelas</Name>
  <KeyCount>2</KeyCount>
  <MaxKeys>1000</MaxKeys>
  <IsTruncated>false</IsTruncated>
  <Contents>
    <Key>hello.txt</Key>
    <LastModified>2026-11-03T09:05:00.000Z</LastModified>
    <ETag>"5d41402abc4b2a76b9719d911017c592"</ETag>
    <Size>15</Size>
  </Contents>
  <Contents>
    <Key>foto/user-123.jpg</Key>
    <LastModified>2026-11-03T09:06:00.000Z</LastModified>
    <ETag>"0cc175b9c0f1b6a831c399e269772661"</ETag>
    <Size>20480</Size>
  </Contents>
</ListBucketResult>
```

`list-type=2` adalah versi listing yang sekarang dipakai. Versi lama (`ListObjects`) masih ada tapi sudah usang.

### Filter dengan prefix dan delimiter

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  "$S3_ENDPOINT/materi-kelas?list-type=2&prefix=foto/&delimiter=/" -i
```

Dengan cara ini S3 meniru folder: `prefix` membatasi awalan key, `delimiter` memotong hasil pada satu tingkat.

### Pagination

S3 mengembalikan maksimal 1000 key per request. Kalau `IsTruncated` bernilai `true`, ambil halaman berikutnya dengan `continuation-token`:

```bash
"$S3_ENDPOINT/materi-kelas?list-type=2&continuation-token=<token-dari-response>"
```

::: danger Jangan Anggap Satu Request Cukup
Kode yang hanya memanggil `ListObjectsV2` sekali akan diam-diam kehilangan data begitu bucket berisi lebih dari 1000 object. Selalu periksa `IsTruncated` dan lanjutkan selama masih `true`.
:::

---

## Range: Ambil Sebagian File

Untuk video atau file besar, kamu tidak perlu mengunduh semuanya:

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  -H "Range: bytes=0-4" \
  "$S3_ENDPOINT/materi-kelas/hello.txt" -i
```

Status berubah menjadi `206 Partial Content`, dan body hanya berisi 5 byte pertama. Karena itu seeking video di browser terasa instan: browser meminta potongan, bukan seluruh file.

Range di luar ukuran file menghasilkan `416 Range Not Satisfiable`.

---

## CopyObject

```bash
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  -X PUT \
  -H "x-amz-copy-source: /materi-kelas/hello.txt" \
  "$S3_ENDPOINT/materi-kelas/salinan.txt" -i
```

Response-nya XML berisi `CopyObjectResult` dan `ETag` object baru. Perhatikan: sumber ditulis di header, tujuan di path.

---

## DeleteObject dan DeleteBucket

```bash
# Hapus satu object, status 204
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  -X DELETE "$S3_ENDPOINT/materi-kelas/salinan.txt" -i

# Hapus bucket, hanya boleh kalau kosong
curl -sS --aws-sigv4 "$SIGV4" --user "$S3_ACCESS_KEY:$S3_SECRET_KEY" \
  -X DELETE "$S3_ENDPOINT/latihan-http" -i
```

`DeleteObject` bersifat idempoten: menghapus object yang tidak ada tetap dianggap berhasil. Jangan mengandalkan `404` untuk mendeteksi apakah object pernah ada.

`DeleteBucket` akan gagal dengan `409 BucketNotEmpty` kalau masih ada object di dalamnya.

---

## Gotcha yang Sering Menggigit

### 1. Key harus di-encode di URL

Spasi dan karakter khusus harus di-encode. Key `catatan kuliah.txt` ditulis:

```bash
"$S3_ENDPOINT/materi-kelas/catatan%20kuliah.txt"
```

Garis miring tidak di-encode karena dianggap bagian dari struktur key.

### 2. ETag bukan selalu MD5

Upload biasa menghasilkan ETag mirip MD5. Upload multipart menghasilkan ETag dengan akhiran `-N`. Jangan membandingkan ETag dengan MD5 file secara membabi buta.

### 3. Status 403 bisa berarti "tidak ada"

Seperti dibahas di pertemuan 2: tanpa izin `ListBucket`, key yang tidak ada dilaporkan sebagai `403 AccessDenied`, bukan `404`.

### 4. Jam sistem harus benar

Selisih lebih dari 15 menit dari jam server menghasilkan `RequestTimeTooSkewed`. Di VM atau container yang lama tidur, ini sering terjadi. Solusinya sinkronkan waktu (`timedatectl` atau NTP).

### 5. Content-Type menentukan nasib file

Tanpa `Content-Type` yang benar, file tetap tersimpan, tapi browser bisa mengunduhnya sebagai file biner atau menampilkannya sebagai teks berantakan. Selalu kirim dari tipe file asli.

---

## Latihan

1. Jalankan `ListBuckets`, lalu buat bucket `latihan-http` lewat `curl`.
2. Upload `hello.txt` dengan `Content-Type: text/plain` dan satu user metadata. Buktikan metadata itu muncul di `HEAD`.
3. Ambil 5 byte pertama file dengan `Range`. Catat status code-nya.
4. List isi bucket dengan `prefix` dan `delimiter`, lalu jelaskan bedanya dengan tanpa filter.
5. Copy `hello.txt` menjadi `salinan.txt`, lalu hapus keduanya dan hapus bucket-nya.
6. Tantangan: coba akses object yang tidak ada. Catat status code dan isi XML error-nya. Lalu jelaskan kenapa hasilnya bisa berbeda kalau kredensialnya tidak punya izin list.

---

## Referensi

- [Amazon S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
- [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html)
- [ListObjectsV2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html)
- [S3 Error Responses](https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html)

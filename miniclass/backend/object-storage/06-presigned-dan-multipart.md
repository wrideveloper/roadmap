# Presigned URL dan Multipart

::: info Prasyarat Modul
Kamu sudah bisa upload dan download lewat CLI dan SDK. Dua topik terakhir ini yang membuat object storage terasa nyata di aplikasi: memberi akses sementara ke browser, dan mengirim file besar tanpa putus.
:::

Sampai sini ada dua masalah dalam desain kita.

Pertama, browser tidak boleh memegang access key, tapi tetap harus bisa mengunggah dan menampilkan file.

Kedua, upload satu request akan gagal untuk file besar, dan gagal di tengah jalan berarti mengulang dari nol.

**Presigned URL** menyelesaikan masalah pertama. **Multipart upload** menyelesaikan masalah kedua.

---

## Presigned URL: Idenya

Backend memegang kredensial. Browser tidak. Jadi setiap kali browser butuh akses, dia minta izin dulu ke backend.

Backend memeriksa apakah user boleh melakukan aksi itu, lalu menerbitkan URL yang sudah ditandatangani dan berlaku sebentar. Browser memakai URL itu langsung ke storage.

Keuntungannya:

1. **Kredensial tidak keluar dari server.** Browser hanya menerima URL sementara.
2. **Backend tidak meneruskan byte.** File mengalir langsung browser ke storage, jadi upload 100 MB tidak membebani server aplikasi.
3. **Izin tetap di tangan backend.** URL kedaluwarsa dalam hitungan menit.

---

## Anatomi Presigned URL

Presigned URL adalah request S3 biasa yang tanda tangannya dipindah dari header `Authorization` ke query string:

```text
http://localhost:9000/materi-kelas/hello.txt
  ?X-Amz-Algorithm=AWS4-HMAC-SHA256
  &X-Amz-Credential=kelasadmin%2F20261103%2Fus-east-1%2Fs3%2Faws4_request
  &X-Amz-Date=20261103T090000Z
  &X-Amz-Expires=600
  &X-Amz-SignedHeaders=host
  &X-Amz-Signature=5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7
```

| Parameter | Arti |
| :--- | :--- |
| `X-Amz-Algorithm` | Algoritma tanda tangan, selalu `AWS4-HMAC-SHA256` |
| `X-Amz-Credential` | Access key dan scope tanggal/region/service |
| `X-Amz-Date` | Waktu URL dibuat |
| `X-Amz-Expires` | Masa berlaku dalam detik |
| `X-Amz-SignedHeaders` | Header yang ikut ditandatangani |
| `X-Amz-Signature` | Tanda tangannya |

Karena tanda tangan mengikat method dan key, URL untuk `GET` tidak bisa dipakai untuk `PUT`, dan URL untuk satu key tidak bisa dipakai untuk key lain.

::: warning Masa Berlaku Maksimal 7 Hari
SigV4 membatasi `X-Amz-Expires` sampai 604800 detik (7 hari). Untuk file pribadi, pakai 5 sampai 15 menit. Semakin pendek, semakin kecil kerusakan kalau URL bocor.
:::

---

## Membuat Presigned URL

```bash
npm install @aws-sdk/s3-request-presigner
```

```javascript
import {
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./s3.js";

const BUCKET = "materi-kelas";

// Download, berlaku 10 menit
const getUrl = await getSignedUrl(
  s3,
  new GetObjectCommand({ Bucket: BUCKET, Key: "hello.txt" }),
  { expiresIn: 600 }
);

// Upload, berlaku 10 menit
const putUrl = await getSignedUrl(
  s3,
  new PutObjectCommand({
    Bucket: BUCKET,
    Key: "unggahan/user-123.jpg",
    ContentType: "image/jpeg",
  }),
  { expiresIn: 600 }
);

console.log("GET:", getUrl);
console.log("PUT:", putUrl);
```

Uji tanpa kredensial sama sekali:

```bash
# Download langsung dari URL
curl -sS "<getUrl>" -o hasil.txt

# Upload langsung dari URL
curl -sS -X PUT --data-binary @foto.jpg \
  -H "Content-Type: image/jpeg" \
  "<putUrl>"
```

Kalau berhasil, artinya URL itu sendiri sudah cukup sebagai izin. Tidak ada header `Authorization`, tidak ada access key.

::: danger Content-Type Harus Sama Persis
`ContentType` saat membuat presigned PUT harus sama dengan header `Content-Type` saat upload. Beda sedikit saja, tanda tangan dianggap tidak sah. Ini penyebab error paling sering di bagian ini.
:::

---

## Alur Foto Profil

Rangkaian lengkapnya:

### Upload

1. Frontend minta izin: `GET /api/foto-profil/upload-url?contentType=image/jpeg`.
2. Backend cek user login, tentukan key `profil/user-123.jpg`, buat presigned PUT 5 menit.
3. Frontend `fetch(putUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } })`.
4. Frontend konfirmasi ke backend dengan key-nya. Backend simpan key ke database.

### Tampil

1. Frontend minta URL: `GET /api/foto-profil/url`.
2. Backend cek hak akses, buat presigned GET 10 menit.
3. Frontend pasang di `<img src={url}>`.

### Kenapa tidak upload lewat backend saja?

Untuk aplikasi kecil, itu sah. Tapi pola presigned punya dua keunggulan yang terasa saat skala naik: backend tidak memakan bandwidth untuk meneruskan file, dan link yang bocor cepat mati.

::: tip Kapan Tidak Perlu Presigned
Kalau file memang publik (logo, gambar artikel), buat prefix atau bucket-nya publik dan sajikan URL langsung. Presigned URL hanya untuk file yang butuh izin.
:::

---

## Multipart Upload

S3 membatasi satu `PutObject` sekitar 5 GB. Bahkan di bawah batas itu, mengirim file 2 GB dalam satu request rapuh: koneksi putus di menit ke-30, dan kamu mulai dari nol.

**Multipart upload** memecah file menjadi beberapa part, mengunggahnya terpisah, lalu menggabungkannya.

### Aturan penting

| Aturan | Nilai |
| :--- | :--- |
| Ukuran maksimal object | 5 TiB |
| Ukuran maksimal satu part | 5 GiB |
| Ukuran minimal satu part (kecuali part terakhir) | 5 MiB |
| Jumlah part maksimal | 10.000 |

Rekomendasi praktis: mulai multipart di atas 100 MB, pakai part 5 sampai 15 MB.

### Tiga langkah

1. `CreateMultipartUpload` mengembalikan `UploadId`.
2. `UploadPart` dipanggil berkali-kali, masing-masing mengembalikan `ETag` part.
3. `CompleteMultipartUpload` mengirim daftar nomor part dan ETag-nya.

Kalau gagal di tengah, panggil `AbortMultipartUpload` agar part-part setengah jadi tidak menumpuk dan menagih biaya storage.

### Cara mudah: lib-storage

Menulis tiga langkah itu manual melelahkan. AWS menyediakan helper:

```bash
npm install @aws-sdk/lib-storage
```

```javascript
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Upload } from "@aws-sdk/lib-storage";
import { s3 } from "./s3.js";

const path = "./video.mp4";
const { size } = await stat(path);

const upload = new Upload({
  client: s3,
  params: {
    Bucket: "materi-kelas",
    Key: "video/kuliah.mp4",
    Body: createReadStream(path),
    ContentType: "video/mp4",
  },
  partSize: 10 * 1024 * 1024,
  queueSize: 4,
});

upload.on("httpUploadProgress", ({ loaded, total }) => {
  const persen = ((loaded / (total || size)) * 100).toFixed(1);
  console.log(`${persen}%`);
});

try {
  await upload.done();
  console.log("selesai");
} catch (err) {
  console.error("gagal:", err.name);
  await upload.abort();
}
```

`lib-storage` otomatis memilih single PUT untuk file kecil dan multipart untuk file besar. Kamu tidak perlu menulis percabangan sendiri.

::: warning Abort Itu Wajib
Tanpa `abort()`, part yang sudah terunggah tetap tersimpan dan tetap menagih biaya. Di AWS, ini bisa jadi tagihan tak terlihat. Di RustFS lokal, ini memenuhi disk. Selalu abort saat gagal.
:::

---

## Membersihkan Multipart yang Menggantung

Proses yang mati di tengah bisa meninggalkan multipart upload tanpa penyelesaian. Di AWS, atasi dengan lifecycle rule `AbortIncompleteMultipartUpload`. Di RustFS, cek bagian multipart pada bucket lewat console, atau jalankan pembersihan berkala.

Multipart yang tidak pernah di-complete akan menumpuk dan menagih biaya storage. Perlakukan seperti log lama: bersihkan secara berkala.

---

## Latihan Akhir

1. Buat presigned GET dan PUT 10 menit. Buktikan keduanya berhenti bekerja setelah kedaluwarsa.
2. Implementasikan alur foto profil lengkap: minta URL, upload langsung, konfirmasi, tampilkan.
3. Coba akses object privat tanpa presigned URL. Pastikan ditolak.
4. Upload file 200 MB dengan `lib-storage`. Amati progres, lalu bandingkan dengan `PutObject` biasa.
5. Sengaja putuskan upload di tengah, lalu cek apakah ada multipart yang menggantung. Bersihkan.
6. Tantangan: jelaskan ke temanmu, tanpa membuka catatan, kenapa backend tidak boleh meneruskan byte file dan bagaimana presigned URL menyelesaikan masalah kredensial di browser.

Di pertemuan berikutnya kita membangun file manager kecil yang memakai semua konsep ini: upload lewat presigned URL, tabel `files`, edit gambar, dan hapus object.

---

## Referensi

- [Sharing Objects with Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- [Uploading and Copying Objects Using Multipart Upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)
- [Amazon S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
- [RustFS Documentation](https://docs.rustfs.com/en)

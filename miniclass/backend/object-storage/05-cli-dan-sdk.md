# CLI dan SDK

::: info Prasyarat Modul
Kamu sudah bisa melakukan operasi S3 lewat `curl`. Sekarang kita naik satu tingkat: alat yang menandatangani request untukmu, supaya kamu tidak menulis header manual di pekerjaan sehari-hari.
:::

Ada tiga tingkat alat di ekosistem S3:

| Tingkat | Alat | Kapan dipakai |
| :--- | :--- | :--- |
| Protokol | `curl` | Belajar, debugging, memastikan request yang dikirim |
| Operasi | `mc`, AWS CLI | Kerja manual, script, backup |
| Aplikasi | SDK (`aws-sdk`, Flysystem) | Kode backend yang berjalan terus |

Pertemuan sebelumnya membahas tingkat pertama. Sekarang kita bahas dua sisanya. Ketiganya mengirim request HTTP yang sama; yang berbeda hanya siapa yang menandatangani.

---

## mc (MinIO Client)

`mc` adalah CLI ringkas untuk object storage. Nama aslinya MinIO Client, tapi karena bicara S3, dia bekerja dengan RustFS, AWS, dan penyedia lain.

### Install

```bash
# macOS
brew install minio/stable/mc

# Linux
curl -O https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
```

Windows: unduh `mc.exe` dari halaman rilis MinIO.

### Daftarkan server

```bash
mc alias set rustfs http://localhost:9000 kelasadmin kelasrahasia123
```

Formatnya: `mc alias set <nama-alias> <endpoint> <access-key> <secret-key>`. Setelah ini, `rustfs` bisa dipakai sebagai ganti alamat panjang.

### Operasi dasar

```bash
# Buat bucket
mc mb rustfs/tugas-kelas

# Upload satu file
mc cp ./laporan.pdf rustfs/tugas-kelas/

# Upload seluruh folder
mc cp --recursive ./foto-wisuda/ rustfs/foto-profil/

# Lihat isi bucket
mc ls rustfs/tugas-kelas/

# Download
mc cp rustfs/tugas-kelas/laporan.pdf ./laporan-download.pdf

# Hapus object
mc rm rustfs/tugas-kelas/laporan.pdf

# Hapus bucket kosong
mc rb rustfs/tugas-kelas
```

::: tip Polanya Seperti Git Remote
`rustfs/tugas-kelas/laporan.pdf` dibaca: alias server, bucket, key. Sama seperti `origin/main`. Setelah pola ini dipahami, perintah `mc` lain mengikuti bentuk yang sama.
:::

---

## AWS CLI

AWS CLI adalah alat umum untuk semua layanan AWS. Perintahnya sama persis dengan yang nanti kamu pakai ke S3 sungguhan, jadi skill-nya langsung transfer.

### Install

```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Konfigurasi

Set environment variable agar tidak menulis flag panjang di setiap perintah:

```bash
export AWS_ACCESS_KEY_ID=kelasadmin
export AWS_SECRET_ACCESS_KEY=kelasrahasia123
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:9000
```

### Operasi dasar

```bash
# Buat bucket
aws s3 mb s3://tugas-kelas

# Upload satu file
aws s3 cp ./laporan.pdf s3://tugas-kelas/

# Upload folder
aws s3 cp ./foto-wisuda/ s3://foto-profil/ --recursive

# List
aws s3 ls s3://tugas-kelas/

# Download
aws s3 cp s3://tugas-kelas/laporan.pdf ./laporan-download.pdf

# Hapus
aws s3 rm s3://tugas-kelas/laporan.pdf
```

::: warning Region Wajib Diisi
RustFS lokal tidak peduli region, tapi CLI dan SDK selalu memintanya. Isi `us-east-1`. Kalau dikosongkan, kamu akan mendapat error yang membingungkan padahal server sehat.
:::

---

## SDK Node.js

Sekarang bagian yang paling relevan untuk backend: kode yang berjalan di server.

### Install

```bash
mkdir app-upload && cd app-upload
npm init -y
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Klien

Buat `s3.js`:

```javascript
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});
```

Tiga hal yang wajib benar:

1. **`endpoint`** menunjuk ke RustFS, bukan AWS.
2. **`region`** wajib diisi.
3. **`forcePathStyle: true`**, karena tidak ada wildcard DNS di lokal.

### Upload, list, download

Buat `upload.js`:

```javascript
import { readFile } from "node:fs/promises";
import {
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { s3 } from "./s3.js";

const BUCKET = "dari-kode";

try {
  await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
  console.log("bucket dibuat:", BUCKET);
} catch (err) {
  if (err.name !== "BucketAlreadyOwnedByYou") throw err;
  console.log("bucket sudah ada:", BUCKET);
}

const body = await readFile("./foto.jpg");

await s3.send(
  new PutObjectCommand({
    Bucket: BUCKET,
    Key: "profil/user-123.jpg",
    Body: body,
    ContentType: "image/jpeg",
  })
);

const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
console.log("isi bucket:", list.Contents.map((o) => o.Key));

const { Body } = await s3.send(
  new GetObjectCommand({ Bucket: BUCKET, Key: "profil/user-123.jpg" })
);
console.log("download berhasil:", Body.constructor.name);
```

Jalankan (siapkan `foto.jpg` dulu):

```bash
node upload.js
```

### Pagination di SDK

Sama seperti `curl`, SDK mengembalikan maksimal 1000 key. Jangan berhenti di halaman pertama:

```javascript
let token;
const semua = [];

do {
  const res = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: token,
    })
  );
  semua.push(...(res.Contents || []));
  token = res.IsTruncated ? res.NextContinuationToken : undefined;
} while (token);
```

### Error handling

SDK melempar exception dengan field yang konsisten:

```javascript
import { S3ServiceException } from "@aws-sdk/client-s3";

try {
  await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: "tidak-ada.txt" }));
} catch (err) {
  if (err instanceof S3ServiceException) {
    console.error("kode:", err.name);
    console.error("status:", err.$metadata.httpStatusCode);
    console.error("request id:", err.$metadata.requestId);
  }
  throw err;
}
```

Kode yang sering kamu tangani:

| `err.name` | Status | Arti |
| :--- | :--- | :--- |
| `NoSuchKey` | 404 | Object tidak ada |
| `NoSuchBucket` | 404 | Bucket tidak ada |
| `AccessDenied` | 403 | Kredensial atau izin salah |
| `BucketAlreadyExists` | 409 | Nama bucket dipakai |
| `BucketNotEmpty` | 409 | Hapus isi dulu sebelum hapus bucket |
| `PreconditionFailed` | 412 | Syarat `If-None-Match` gagal |
| `EntityTooLarge` | 400 | Body melebihi batas single upload |

::: warning Jangan Cek Pesan Error
Jangan mencocokkan `err.message`, karena teksnya bisa berubah antar versi atau antar penyedia. Cek `err.name` dan `err.$metadata.httpStatusCode`.
:::

---

## SDK Laravel

Laravel memakai Flysystem dengan driver S3. Tidak perlu SDK manual.

`.env`:

```text
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=kelasadmin
AWS_SECRET_ACCESS_KEY=kelasrahasia123
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=dari-kode
AWS_ENDPOINT=http://localhost:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
```

`AWS_USE_PATH_STYLE_ENDPOINT=true` adalah padanan `forcePathStyle` di Node.

Pemakaian:

```php
use Illuminate\Support\Facades\Storage;

$path = $request->file('foto')->store('profil', 's3');
// simpan string $path ke database, bukan file-nya
```

Yang disimpan di database hanya path. File tetap di object storage.

---

## Kalau Aplikasi Jalan di Container

Kalau aplikasi dan RustFS ada di Compose yang sama, endpoint-nya berubah:

```yaml
services:
  app:
    build: .
    environment:
      S3_ENDPOINT: http://rustfs:9000
    depends_on:
      rustfs:
        condition: service_started
  rustfs:
    image: rustfs/rustfs:1.0.4
```

Dari dalam container, `localhost` menunjuk ke container itu sendiri, bukan ke RustFS. Pakai nama service, persis seperti pelajaran network di modul Docker.

::: tip Satu Kode, Dua Endpoint
Baca endpoint dari environment variable. Di laptop isinya `localhost`, di Compose isinya `http://rustfs:9000`. Kode sama, konfigurasi beda.
:::

---

## Latihan

1. Daftarkan server RustFS di `mc`, lalu ulangi latihan upload dan list dari pertemuan 4 memakai `mc`.
2. Lakukan hal yang sama dengan AWS CLI ke bucket berbeda.
3. Buat project Node.js, upload satu file lewat SDK, verifikasi lewat `mc ls`.
4. Panggil `GetObject` untuk key yang tidak ada. Tangkap error-nya dan cetak `err.name` serta `err.$metadata.httpStatusCode`.
5. Tantangan: tulis fungsi `listSemua(bucket)` yang menangani pagination, lalu uji dengan lebih dari 1000 object (bisa dibuat dengan loop upload kecil).

---

## Referensi

- [AWS SDK for JavaScript v3: S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/)
- [RustFS: JavaScript SDK](https://docs.rustfs.com/en/developer/sdk/javascript)
- [Amazon S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)

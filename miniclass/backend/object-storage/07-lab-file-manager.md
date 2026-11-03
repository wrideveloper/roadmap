# Lab Akhir: File Manager dengan Edit Gambar

::: info Prasyarat Modul
Kamu sudah menyelesaikan pertemuan 1 sampai 6, punya RustFS yang berjalan, dan nyaman memakai `aws-sdk` v3 di Node.js. Lab ini menggabungkan semuanya menjadi satu aplikasi kecil.
:::

Lab ini membangun file manager sederhana: upload gambar, lihat daftar, ubah ukuran, crop persegi, dan hapus. Semua file disimpan di RustFS, sedangkan metadata disimpan di SQLite.

Tujuannya bukan membuat aplikasi produksi, tapi melihat bagaimana potongan-potongan modul ini bekerja bersama: presigned URL, tabel `files`, pipeline gambar, dan urutan operasi storage.

---

## Apa yang Dibangun

| Fitur | Endpoint |
| :--- | :--- |
| Minta izin upload | `POST /api/files/upload-url` |
| Konfirmasi upload | `POST /api/files/confirm` |
| Daftar file | `GET /api/files` |
| Resize atau crop | `POST /api/files/:id/edit` |
| Hapus file | `DELETE /api/files/:id` |

Di luar cakupan lab: login sungguhan, upload multipart dari browser, filter gambar, dan share link. Beberapa di antaranya masuk ke bagian stretch goal.

---

## Struktur Project

```text
file-manager/
|-- compose.yaml
|-- package.json
|-- public/
|   `-- index.html
|-- data/                  # dibuat otomatis, isi SQLite
`-- src/
    |-- server.js
    |-- db.js
    |-- s3.js
    |-- image.js
    `-- routes/
        `-- files.js
```

Dependency:

```bash
npm init -y
npm pkg set type=module
npm install express better-sqlite3 @aws-sdk/client-s3 @aws-sdk/s3-request-presigner sharp
```

`type=module` diperlukan agar `import` bekerja tanpa konfigurasi tambahan.

---

## Menjalankan RustFS

Compose hanya berisi RustFS. Aplikasi Node berjalan langsung di host, jadi tidak ada Dockerfile dan tidak ada build image.

`compose.yaml`:

```yaml
name: file-manager

services:
  rustfs:
    image: rustfs/rustfs:1.0.4
    container_name: rustfs-server
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - RUSTFS_ADDRESS=:9000
      - RUSTFS_CONSOLE_ADDRESS=:9001
      - RUSTFS_CONSOLE_ENABLE=true
      - RUSTFS_ACCESS_KEY=kelasadmin
      - RUSTFS_SECRET_KEY=kelasrahasia123
      - RUSTFS_CORS_ALLOWED_ORIGINS=http://localhost:3000
    volumes:
      - rustfs-data:/data
    restart: unless-stopped

volumes:
  rustfs-data:
```

Jalankan:

```bash
docker compose up -d
```

Karena aplikasi berjalan di host, endpoint S3-nya `http://localhost:9000`, bukan nama service.

---

## Skema SQLite

`src/db.js`:

```javascript
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const path = process.env.DB_PATH || "./data/app.db";
mkdirSync(dirname(path), { recursive: true });

export const db = new Database(path);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id             TEXT PRIMARY KEY,
    owner_id       TEXT NOT NULL,
    bucket         TEXT NOT NULL,
    original_key   TEXT NOT NULL,
    display_key    TEXT,
    thumb_key      TEXT,
    original_name  TEXT NOT NULL,
    content_type   TEXT NOT NULL,
    size_bytes     INTEGER NOT NULL,
    width          INTEGER,
    height         INTEGER,
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT,
    deleted_at     TEXT,
    UNIQUE (bucket, original_key)
  );

  CREATE INDEX IF NOT EXISTS files_owner_idx ON files (owner_id);
`);
```

`display_key` dan `thumb_key` sengaja nullable. Sebelum diedit, file hanya punya `original_key`. Daftar file akan memakai original sebagai fallback.

`id` dibuat di Node dengan `randomUUID()`, karena SQLite tidak punya tipe UUID bawaan.

---

## Klien S3

`src/s3.js`:

```javascript
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const BUCKET = process.env.S3_BUCKET || "file-manager";

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "kelasadmin",
    secretAccessKey: process.env.S3_SECRET_KEY || "kelasrahasia123",
  },
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

::: warning CORS dan Checksum di Browser
Browser mengunggah langsung ke RustFS di port 9000, jadi request-nya cross-origin. RustFS hanya mengirim header CORS kalau `RUSTFS_CORS_ALLOWED_ORIGINS` diisi. Compose di atas sudah mengisinya.

Versi baru AWS SDK v3 juga menambahkan parameter checksum ke presigned URL secara default. Checksum itu dihitung untuk body kosong, sehingga upload dari browser gagal walaupun CORS sudah benar. Dua opsi `requestChecksumCalculation` dan `responseChecksumValidation` di `S3Client` mematikannya.
:::

export async function ensureBucket() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
  }
}

export function presignPut(key, contentType, expiresIn = 600) {
  return getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
    { expiresIn }
  );
}

export function presignGet(key, expiresIn = 600) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn }
  );
}
```

`ensureBucket` dipanggil saat server start, supaya lab tidak gagal hanya karena bucket belum dibuat.

---

## Pipeline Gambar

`src/image.js`:

```javascript
import sharp from "sharp";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);
const MAX_PIXELS = 40_000_000;

export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function buildVariants(buf, { mode = "resize", width, size } = {}) {
  const meta = await sharp(buf, { limitInputPixels: MAX_PIXELS }).metadata();
  if (!ALLOWED_FORMATS.has(meta.format)) {
    throw httpError(415, "Format gambar tidak didukung");
  }

  const target =
    mode === "square"
      ? Math.min(Number(size) || 400, 2000)
      : Math.min(Number(width) || 1600, 4000);

  const displayPipeline = sharp(buf, { limitInputPixels: MAX_PIXELS }).rotate();

  if (mode === "square") {
    displayPipeline.resize({
      width: target,
      height: target,
      fit: "cover",
      position: "centre",
    });
  } else {
    displayPipeline.resize({ width: target, withoutEnlargement: true });
  }

  const display = await displayPipeline.jpeg({ quality: 82 }).toBuffer();

  const thumb = await sharp(buf, { limitInputPixels: MAX_PIXELS })
    .rotate()
    .resize({ width: 400, height: 400, fit: "cover", position: "centre" })
    .jpeg({ quality: 80 })
    .toBuffer();

  const out = await sharp(display).metadata();
  return { display, thumb, width: out.width, height: out.height };
}
```

Tiga hal yang dijaga di sini:

- `limitInputPixels` menolak gambar yang dimensinya terlalu besar, sehingga tidak menghabiskan memori saat decode.
- `rotate()` tanpa argumen mengikuti orientasi EXIF, lalu encoding ulang membuang metadata EXIF.
- Format dideteksi dari isi file, bukan dari ekstensi.

---

## Kontrak API

Semua route memakai header `x-user-id` sebagai identitas. Kalau header tidak dikirim, server memakai `demo-user`.

### `POST /api/files/upload-url`

Request:

```json
{
  "name": "foto.jpg",
  "contentType": "image/jpeg",
  "size": 204800
}
```

Validasi: tipe harus salah satu dari `image/jpeg`, `image/png`, `image/webp`; ukuran maksimal 15 MB.

Response:

```json
{
  "fileId": "0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b",
  "key": "originals/0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b/source",
  "uploadUrl": "http://localhost:9000/file-manager/originals/...",
  "expiresIn": 600
}
```

### `POST /api/files/confirm`

Request:

```json
{
  "fileId": "0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b",
  "key": "originals/0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b/source",
  "name": "foto.jpg",
  "contentType": "image/jpeg"
}
```

Server menjalankan `HeadObject`, memastikan key sesuai dengan `fileId`, memeriksa ulang tipe dan ukuran dari response S3, lalu menyimpan baris.

### `GET /api/files`

Response:

```json
[
  {
    "id": "0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b",
    "name": "foto.jpg",
    "width": 1600,
    "height": 1067,
    "size": 204800,
    "thumbUrl": "http://localhost:9000/...",
    "displayUrl": "http://localhost:9000/..."
  }
]
```

### `POST /api/files/:id/edit`

Request:

```json
{ "mode": "resize", "width": 800 }
```

atau:

```json
{ "mode": "square", "size": 400 }
```

Response berisi metadata terbaru dan URL turunan.

### `DELETE /api/files/:id`

Menandai `deleted_at`, lalu menghapus object original dan turunannya. Response `204`.

---

## Implementasi Route

`src/routes/files.js`:

```javascript
import { Router } from "express";
import { randomUUID } from "node:crypto";
import {
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { db } from "../db.js";
import { BUCKET, s3, presignGet, presignPut } from "../s3.js";
import {
  ALLOWED_TYPES,
  MAX_UPLOAD_BYTES,
  buildVariants,
  httpError,
} from "../image.js";

export const router = Router();

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const ownerOf = (req) => req.header("x-user-id") || "demo-user";

const COLUMNS =
  "id, owner_id, bucket, original_key, display_key, thumb_key, original_name, " +
  "content_type, size_bytes, width, height, created_at, updated_at, deleted_at";

const owned = db.prepare(
  `SELECT ${COLUMNS} FROM files WHERE id = ? AND owner_id = ? AND deleted_at IS NULL`
);

function item(row) {
  const displayKey = row.display_key || row.original_key;
  const thumbKey = row.thumb_key || displayKey;
  return Promise.all([presignGet(displayKey), presignGet(thumbKey)]).then(
    ([displayUrl, thumbUrl]) => ({
      id: row.id,
      name: row.original_name,
      width: row.width,
      height: row.height,
      size: row.size_bytes,
      displayUrl,
      thumbUrl,
    })
  );
}

router.post(
  "/upload-url",
  wrap(async (req, res) => {
    const { name, contentType, size } = req.body;
    if (!ALLOWED_TYPES.has(contentType)) {
      throw httpError(415, "Tipe file tidak didukung");
    }
    if (!Number.isInteger(size) || size <= 0 || size > MAX_UPLOAD_BYTES) {
      throw httpError(413, "Ukuran file melebihi batas 15 MB");
    }

    const fileId = randomUUID();
    const key = `originals/${fileId}/source`;
    res.json({
      fileId,
      key,
      uploadUrl: await presignPut(key, contentType),
      expiresIn: 600,
    });
  })
);

router.post(
  "/confirm",
  wrap(async (req, res) => {
    const owner = ownerOf(req);
    const { fileId, key, name, contentType } = req.body;

    if (key !== `originals/${fileId}/source`) {
      throw httpError(400, "Key tidak sesuai dengan fileId");
    }

    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    const actualType = head.ContentType || contentType;

    if (!ALLOWED_TYPES.has(actualType)) {
      throw httpError(415, "Tipe file tidak didukung");
    }
    if (head.ContentLength > MAX_UPLOAD_BYTES) {
      throw httpError(413, "Ukuran file melebihi batas 15 MB");
    }

    db.prepare(
      `INSERT INTO files (id, owner_id, bucket, original_key, original_name, content_type, size_bytes)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO NOTHING`
    ).run(fileId, owner, BUCKET, key, name, actualType, head.ContentLength);

    const row = owned.get(fileId, owner);
    if (!row) throw httpError(409, "File sudah terdaftar untuk user lain");
    res.status(201).json(await item(row));
  })
);

router.get(
  "/",
  wrap(async (req, res) => {
    const rows = db
      .prepare(
        `SELECT ${COLUMNS} FROM files WHERE owner_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`
      )
      .all(ownerOf(req));

    res.json(await Promise.all(rows.map(item)));
  })
);

router.post(
  "/:id/edit",
  wrap(async (req, res) => {
    const owner = ownerOf(req);
    const row = owned.get(req.params.id, owner);
    if (!row) throw httpError(404, "File tidak ditemukan");

    const obj = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: row.original_key })
    );

    const chunks = [];
    for await (const chunk of obj.Body) chunks.push(chunk);
    const buf = Buffer.concat(chunks);

    if (buf.length > MAX_UPLOAD_BYTES) {
      throw httpError(413, "Ukuran file melebihi batas");
    }

    const { display, thumb, width, height } = await buildVariants(buf, req.body);

    const displayKey = `derived/${row.id}/display.jpg`;
    const thumbKey = `derived/${row.id}/thumb.jpg`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: displayKey,
        Body: display,
        ContentType: "image/jpeg",
      })
    );
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: thumbKey,
        Body: thumb,
        ContentType: "image/jpeg",
      })
    );

    db.prepare(
      `UPDATE files
       SET display_key = ?, thumb_key = ?, width = ?, height = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(displayKey, thumbKey, width, height, row.id);

    const oldKeys = [row.display_key, row.thumb_key].filter(
      (k) => k && k !== displayKey && k !== thumbKey
    );
    for (const oldKey of oldKeys) {
      await s3
        .send(new DeleteObjectCommand({ Bucket: BUCKET, Key: oldKey }))
        .catch((err) => console.error("gagal hapus turunan lama:", oldKey, err.name));
    }

    const updated = owned.get(row.id, owner);
    res.json(await item(updated));
  })
);

router.delete(
  "/:id",
  wrap(async (req, res) => {
    const owner = ownerOf(req);
    const row = owned.get(req.params.id, owner);
    if (!row) throw httpError(404, "File tidak ditemukan");

    db.prepare("UPDATE files SET deleted_at = datetime('now') WHERE id = ?").run(row.id);

    const keys = [row.original_key, row.display_key, row.thumb_key].filter(Boolean);
    for (const key of keys) {
      await s3
        .send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
        .catch((err) => console.error("gagal hapus object:", key, err.name));
    }

    res.status(204).end();
  })
);
```

Perhatikan urutan pada edit: object baru diunggah, baris database diperbarui, baru object lama dihapus. Kalau langkah upload gagal, database belum berubah. Kalau langkah hapus lama gagal, file masih bisa dipakai dan hanya menyisakan object yatim yang bisa dibersihkan nanti.

Pada delete, baris ditandai lebih dulu. Kalau penghapusan object gagal, tombstone tetap ada dan job pembersih bisa mencoba lagi.

---

## Server

`src/server.js`:

```javascript
import express from "express";
import { ensureBucket, BUCKET } from "./s3.js";
import { router } from "./routes/files.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));
app.use("/api/files", router);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.message });
});

await ensureBucket();
app.listen(port, () => {
  console.log(`server jalan di http://localhost:${port}, bucket ${BUCKET}`);
});
```

Jalankan:

```bash
node --watch src/server.js
```

---

## Frontend

`public/index.html` cukup satu file, tanpa framework dan tanpa build step:

```html
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>File Manager</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 760px; margin: 40px auto; padding: 0 16px; }
    form { display: flex; gap: 8px; margin-bottom: 24px; }
    ul { list-style: none; padding: 0; display: grid; gap: 12px; }
    li { display: flex; align-items: center; gap: 12px; border: 1px solid #ddd; padding: 8px; border-radius: 8px; }
    img { width: 72px; height: 72px; object-fit: cover; border-radius: 6px; }
    .meta { flex: 1; }
    button { cursor: pointer; }
  </style>
</head>
<body>
  <h1>File Manager</h1>

  <form id="upload-form">
    <input id="file" type="file" accept="image/jpeg,image/png,image/webp" required />
    <button type="submit">Upload</button>
  </form>

  <ul id="list"></ul>

  <script>
    const list = document.querySelector("#list");

    async function load() {
      const files = await fetch("/api/files").then((r) => r.json());
      list.innerHTML = "";

      for (const file of files) {
        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${file.thumbUrl}" alt="" />
          <div class="meta">
            <strong>${file.name}</strong><br />
            <small>${file.width || "?"} x ${file.height || "?"} - ${Math.round(file.size / 1024)} KB</small>
          </div>
          <button data-action="resize" data-id="${file.id}">Resize 800</button>
          <button data-action="crop" data-id="${file.id}">Crop 400</button>
          <button data-action="delete" data-id="${file.id}">Hapus</button>
        `;
        list.append(li);
      }
    }

    document.querySelector("#upload-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const file = document.querySelector("#file").files[0];
      if (!file) return;

      const init = await fetch("/api/files/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          contentType: file.type,
          size: file.size,
        }),
      }).then((r) => r.json());

      await fetch(init.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      await fetch("/api/files/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: init.fileId,
          key: init.key,
          name: file.name,
          contentType: file.type,
        }),
      });

      event.target.reset();
      await load();
    });

    list.addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;

      const { action, id } = button.dataset;

      if (action === "delete") {
        if (!confirm("Hapus file ini?")) return;
        await fetch(`/api/files/${id}`, { method: "DELETE" });
      } else {
        const body = action === "crop"
          ? { mode: "square", size: 400 }
          : { mode: "resize", width: 800 };
        await fetch(`/api/files/${id}/edit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      await load();
    });

    load();
  </script>
</body>
</html>
```

Alur upload di frontend: minta URL, `PUT` langsung ke RustFS dengan `Content-Type` yang sama seperti saat presign, lalu konfirmasi ke backend. Kalau header `Content-Type` berbeda, tanda tangan ditolak.

---

## Keamanan

- `x-user-id` hanya stub untuk lab. Di aplikasi sungguhan, identitas datang dari sesi atau token yang diverifikasi.
- Setiap endpoint memeriksa `owner_id`. User tidak bisa melihat atau mengubah file milik user lain.
- Tipe dan ukuran dari client diperiksa ulang lewat `HeadObject`, karena client bisa berbohong.
- Presigned URL berlaku 10 menit dan tidak pernah dicatat ke log.
- `limitInputPixels` mencegah decompression bomb, yaitu file kecil yang decode menjadi memori besar.

---

## Uji Manual

| Uji | Hasil yang diharapkan |
| :--- | :--- |
| Upload JPEG 2 MB | Muncul di daftar dengan thumbnail |
| Resize 800 | Lebar menjadi 800, rasio tetap |
| Crop 400 | Gambar menjadi 400 x 400 |
| Hapus | Hilang dari daftar, object hilang di `mc ls` |
| Akses file user lain | `404` atau `403` |
| Upload 20 MB | `413` |
| Upload file `.txt` | `415` |
| Presigned URL kedaluwarsa | `403` |
| Edit dua kali berturut-turut | Object turunan lama tidak menumpuk |

---

## Stretch Goal

1. Rename tampilan: ubah `original_name` saja, object tidak disentuh.
2. Replace isi file: unggah ke key baru, perbarui baris, hapus object lama.
3. Multipart upload untuk file di atas 100 MB.
4. Deteksi duplikat memakai `checksum_sha256`.
5. Kuota per user berdasarkan total `size_bytes`.
6. Share link dengan masa berlaku terbatas.

---

## Checklist Kompetensi

Setelah menyelesaikan modul ini, kamu seharusnya bisa:

- [ ] Menjelaskan bedanya file storage, block storage, dan object storage.
- [ ] Menjelaskan model bucket/key/object dan kenapa key bersifat flat.
- [ ] Membaca request dan response S3: method, path, status code, error XML.
- [ ] Menjelaskan SigV4 secara konsep, tanpa menghitung HMAC manual.
- [ ] Menjalankan RustFS sebagai S3 lokal dan mengelola bucket.
- [ ] Melakukan operasi S3 lewat `curl`, `mc`, AWS CLI, dan SDK.
- [ ] Menjelaskan kenapa `forcePathStyle` wajib di lokal.
- [ ] Membuat presigned URL untuk upload dan download.
- [ ] Mengunggah file besar dengan multipart dan membersihkannya saat gagal.
- [ ] Merancang tabel `files` yang menyimpan referensi, bukan isi file.
- [ ] Membangun alur upload, edit, dan hapus yang menjaga konsistensi object dan database.

---

## Langkah Selanjutnya

1. **CDN di depan storage.** Pelajari Cloudflare atau CloudFront agar file disajikan cepat.
2. **Lifecycle dan versioning.** Aturan hapus otomatis, transisi storage class, dan pemulihan versi lama.
3. **Bucket policy dan CORS.** Izin granular dan upload langsung dari browser tanpa backend perantara.
4. **Tugas akhir gabungan.** Deploy aplikasi container yang stateless, database terpisah, dan file di object storage. Ini gabungan modul Docker, System Design, dan Object Storage.

::: info Contoh Implementasi Lain
Kontrak API yang sama diimplementasikan dalam tiga bahasa di repo terpisah: [file-manager-s3-example](https://github.com/SiputBiru/file-manager-s3-example).

Isinya versi Node.js dengan sharp, Go, dan Axum, semuanya memakai lima endpoint dan skema yang sama. Gunakan sebagai pembanding setelah lab ini selesai, bukan sebagai pengganti.
:::

---

## Referensi

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Express](https://expressjs.com/)
- [Amazon S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
- [RustFS Documentation](https://docs.rustfs.com/en)

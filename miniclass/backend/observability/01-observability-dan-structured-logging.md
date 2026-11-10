# Observability dan Structured Logging

::: info Prasyarat Modul
Selama sudah bisa menjalankan aplikasi file manager dari modul sebelumnya dan juga sudah mulai terbiasa dengan docker things. 

Modul ini tidak mengubah aplikasi sebelumnya.
:::


<img src="https://i.programmerhumor.io/2022/09/programmerhumor-io-programming-memes-47a88711005e0cd.jpg" width="480">

Suatu hari ada laporan: upload gagal untuk sebagian user. Kamu buka terminal, dan yang terlihat hanya baris seperti ini berulang-ulang:

```text
upload
upload
upload
error
upload
```

Log itu tidak cuma user, request, durasi, atau status. Yang isinya hanya memberi tahu bahwa sesuatu terjadi, tanpa cukup petunjuk untuk menemukan penyebabnya.

Modul ini membahas cara membuat log yang bisa digunakan untuk mencari solusi dari permasalahan, bukan cuma mencatat aktivitas.

---

## Observability Bukan Cuma Monitoring

kadang kita kelabik.

| Aspek | Monitoring | Observability |
| :--- | :--- | :--- |
| Pertanyaan | Pertanyaan yang sudah kamu duga sebelumnya | Pertanyaan yang belum kamu duga |
| Contoh | Apakah server hidup? Berapa CPU-nya? | Kenapa upload user A lambat kemarin jam 14.03? |
| Data | Metrik dan alert | Log, metrik, dan trace yang bisa dikorelasikan |
| Cara kerja | Dashboard dan threshold | Menelusuri data untuk menemukan penyebab |

Monitoring menjawab "apakah sistem menyala". 
Observability menjawab "kenapa perilakunya seperti ini".

Tidak mungkin membuat dashboard untuk setiap bug yang mungkin muncul di masa depan. Karena itu, data observability harus dirancang agar tetap bisa dieksplorasi dan menjawab pertanyaan yang bahkan belum terpikirkan sebelumnya.

---

## Tiga Pilar

| Pilar | Menjawab | Contoh | Biaya |
| :--- | :--- | :--- | :--- |
| Logs | Apa yang terjadi pada satu kejadian? | `upload.failed` untuk request `abc-123` | Volume dan storage |
| Metrics | Berapa banyak dan seberapa cepat? | 120 upload per menit, p95 latency 1.2 detik | Cardinality |
| Traces | Ke mana waktu dihabiskan? | 80 persen waktu di `PutObject` ke S3 | Sampling dan storage |

Log adalah cerita per kejadian. Metrik adalah angka agregat. Trace adalah perjalanan satu request melewati beberapa komponen.

Sesi ini fokus pada log. Metrik dan trace dibahas di sesi berikutnya.

---

## Gejala dan Penyebab

<img src="https://i.programmerhumor.io/2023/09/programmerhumor-io-backend-memes-linux-memes-6b3eccb82753699.jpg" width="480">

kita perlu membedakan dua hal:

- **Gejala**: apa yang dilihat user, misalnya "upload gagal" atau "halaman lambat".
- **Penyebab**: kondisi teknis yang membuat gejala itu muncul, misalnya "presigned URL kedaluwarsa", "bucket penuh", atau "proses gambar kehabisan memori".

Log yang buruk hanya mencatat gejala. Log yang baik membawa konteks yang cukup untuk mengejar penyebab.

---

## Log yang Berguna


<img src="https://i.programmerhumor.io/2023/01/programmerhumor-io-programming-memes-58ac414c406a1c8.jpg" width="480">

Log yang berguna biasanya memiliki field berikut:

| Field | Contoh | Kenapa perlu |
| :--- | :--- | :--- |
| `timestamp` | `2026-11-10T09:15:03.421Z` | Mengurutkan kejadian, terutama saat ada beberapa server |
| `severity` | `INFO`, `WARN`, `ERROR` | Memisahkan kejadian normal dari masalah |
| `service` | `file-manager` | Saat ada beberapa service |
| `event` | `upload.completed` | Nama kejadian yang stabil dan mudah dicari |
| `request_id` | `3f1c...` | Menghubungkan beberapa log dari satu request |
| `route` | `POST /api/files/confirm` | Menemukan endpoint yang bermasalah |
| `status` | `201` | Membedakan sukses, kesalahan client, dan kesalahan server |
| `duration_ms` | `184` | Menemukan proses yang lambat |
| `user_id` | `demo-user` | Menjawab "siapa yang terdampak" |

Nama field harus konsisten. `request_id` di satu tempat dan `requestId` di tempat lain akan menyulitkan pencarian.


<img src="https://i.programmerhumor.io/2023/05/programmerhumor-io-cloud-memes-debugging-memes-5e816a82a5cb14f.png" width="480">

### Don't

```text
upload error
```

### Do

```json
{
  "timestamp": "2026-11-10T09:15:03.421Z",
  "severity": "ERROR",
  "service": "file-manager",
  "event": "upload.failed",
  "request_id": "3f1c2a7e-8b4d-4f6a-9c1e-2d3b4a5c6d7e",
  "route": "POST /api/files/confirm",
  "status": 404,
  "duration_ms": 184,
  "error": "NoSuchKey"
}
```

Dari contoh di atas, kamu bisa mencari semua kejadian untuk satu request, melihat endpoint, status, durasi, dan jenis error.

---

## Request ID

Setiap request harus punya ID yang bisa dipakai di semua log terkait. Kalau client mengirim `x-request-id`, pakai nilai itu. Kalau tidak, server membuat sendiri.

`src/middleware/request-context.js`:

```javascript
import { randomUUID } from "node:crypto";
import { log } from "../logger.js";

export function requestContext(req, res, next) {
  const requestId = req.header("x-request-id") || randomUUID();
  const startedAt = performance.now();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  res.on("finish", () => {
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    log(level, "http.request", {
      request_id: requestId,
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      duration_ms: Math.round(performance.now() - startedAt),
    });
  });

  next();
}
```

Pasang sebelum route:

```javascript
app.use(requestContext);
app.use("/api/files", router);
```

Sekarang setiap request punya `req.requestId`, dan response membawa `x-request-id` yang sama. Saat user melapor, kamu bisa meminta ID itu dan mencari seluruh jejaknya.

::: warning Jangan Memakai ID Internal sebagai Request ID
Jangan memakai `user_id`, `file_id`, atau nama file sebagai pengganti request ID. Satu user bisa punya banyak request, dan satu request bisa menyentuh banyak file. Request ID harus unik per request.
:::

---

## Menyiapkan OTel Logs SDK

Sesi ini memakai OpenTelemetry Logs SDK dengan exporter console. Artinya, log dicetak ke terminal melalui API OpenTelemetry, bukan `console.log` langsung. Di sesi berikutnya, exporter console diganti dengan OTLP agar log masuk ke Loki.

Install paket:

```bash
npm install @opentelemetry/api-logs @opentelemetry/sdk-logs @opentelemetry/resources
```

`src/telemetry.js`:

```javascript
import { logs } from "@opentelemetry/api-logs";
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from "@opentelemetry/sdk-logs";
import { resourceFromAttributes } from "@opentelemetry/resources";

const provider = new LoggerProvider({
  resource: resourceFromAttributes({
    "service.name": "file-manager",
    "service.version": "1.0.0",
    "deployment.environment": process.env.NODE_ENV || "development",
  }),
  processors: [
    new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
  ],
});

logs.setGlobalLoggerProvider(provider);
```

Jalankan server dengan telemetry dimuat lebih dulu:

```bash
node --import ./src/telemetry.js src/server.js
```

Flag `--import` memastikan provider sudah aktif sebelum modul lain membuat logger.

Di sesi 2, `ConsoleLogRecordExporter` diganti dengan `OTLPLogExporter` agar log masuk ke Loki. Untuk sesi ini, console exporter cukup supaya kamu bisa melihat bentuk log tanpa menjalankan stack observability.

`src/logger.js`:

```javascript
import { logs, SeverityNumber } from "@opentelemetry/api-logs";

const logger = logs.getLogger("file-manager");

const SEVERITY = {
  debug: SeverityNumber.DEBUG,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR,
};

export function log(level, event, fields = {}) {
  logger.emit({
    severityNumber: SEVERITY[level] || SeverityNumber.INFO,
    severityText: level.toUpperCase(),
    body: event,
    attributes: fields,
  });
}
```

Nama `event` sebaiknya berbentuk objek dan kejadian, misalnya `upload.started`, `upload.completed`, `upload.failed`, bukan kalimat panjang.

---

## Menginstrumentasi Alur Upload

Tambahkan log di titik-titik yang punya nilai diagnosis.

```javascript
router.post("/confirm", async (req, res) => {
  const startedAt = performance.now();

  log("info", "upload.started", {
    request_id: req.requestId,
    route: "POST /api/files/confirm",
    file_id: req.body.fileId,
  });

  try {
    const head = await s3.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: req.body.key })
    );

    log("info", "upload.verified", {
      request_id: req.requestId,
      file_id: req.body.fileId,
      size_bytes: head.ContentLength,
      content_type: head.ContentType,
    });

    // ... simpan metadata ...

    log("info", "upload.completed", {
      request_id: req.requestId,
      file_id: req.body.fileId,
      duration_ms: Math.round(performance.now() - startedAt),
    });

    res.status(201).json(await item(row));
  } catch (err) {
    log("error", "upload.failed", {
      request_id: req.requestId,
      file_id: req.body.fileId,
      error: err.name,
      message: err.message,
      duration_ms: Math.round(performance.now() - startedAt),
    });

    throw err;
  }
});
```

Yang perlu diperhatikan:

- `upload.started` dan `upload.completed` memakai `request_id` yang sama.
- `duration_ms` dihitung di server, bukan ditebak dari timestamp.
- Error mencatat `err.name` dan `message`, bukan seluruh object error.
- Log tidak mencatat isi file, presigned URL, atau access key.

---

## Aturan Logging

1. **Satu kejadian, satu log.** Jangan menaruh log di dalam loop yang berjalan ribuan kali.
2. **Gunakan level yang benar.** `INFO` untuk kejadian normal, `WARN` untuk kesalahan client seperti 415 atau 413, `ERROR` untuk kesalahan server seperti 500.
3. **Jangan log data sensitif.** Token, password, access key, isi file, dan presigned URL tidak boleh masuk log.
4. **Jangan log PII tanpa alasan.** Nama lengkap, email, NIM, dan nomor telepon sebaiknya tidak dicatat mentah.
5. **Pakai waktu UTC.** OTel memakai timestamp sendiri, tetapi field waktu tambahan harus konsisten.
6. **Beri nama event yang stabil.** `upload.failed` lebih mudah dicari daripada `Gagal upload file`.
7. **Jaga volume.** Log debug yang terlalu banyak akan menaikkan biaya dan memperlambat pencarian.

::: danger Presigned URL Itu Kredensial
Presigned URL memberi akses ke object tanpa access key. Jangan pernah mencatat URL lengkapnya ke log, apalagi ke issue tracker atau chat. Kalau perlu debugging, catat bucket dan key saja, bukan query string tanda tangannya.
:::

---

## Lab

Ikuti langkah ini pada salinan aplikasi file manager. Modul ini tidak mengubah repo contoh utama.

1. Install paket OpenTelemetry Logs.
2. Buat `src/telemetry.js` dan `src/logger.js`.
3. Buat middleware `request-context.js` dan pasang di Express.
4. Tambahkan log `upload.started`, `upload.completed`, dan `upload.failed`.
5. Jalankan server dengan `node --import ./src/telemetry.js src/server.js`.
6. Kirim upload dengan request ID sendiri:

```bash
curl -X POST http://localhost:3000/api/files/upload-url \
  -H "Content-Type: application/json" \
  -H "x-request-id: latihan-001" \
  -H "x-user-id: demo-user" \
  -d '{"name":"foto.jpg","contentType":"image/jpeg","size":204800}'
```

7. Cari `latihan-001` di terminal dan pastikan semua log untuk request itu memakai ID yang sama.
8. Sengaja kirim tipe file yang salah dan pastikan muncul log `WARN` dengan status 415.
9. Sengaja matikan RustFS, lalu lihat log `ERROR` untuk request yang sama.

---

## Jebakan yang Sering Muncul

| Gejala | Penyebab |
| :--- | :--- |
| Semua log punya request ID yang sama | Middleware dipasang setelah route, atau ID disimpan di variabel global |
| Log ganda | `console.log` lama masih dipakai bersama logger baru |
| Tidak ada log sama sekali | `telemetry.js` tidak dimuat sebelum modul lain |
| Waktu tidak cocok | Timestamp lokal dipakai, bukan UTC |
| Log terlalu besar | Isi file atau object error dicatat seluruhnya |
| Pencarian lambat | Field tidak konsisten, misal `requestId` dan `request_id` |

---

## Latihan

1. Jelaskan bedanya monitoring dan observability dengan satu contoh dari aplikasi file manager.
2. Tambahkan `request_id` ke response header dan buktikan nilainya sama dengan log.
3. Buat satu log `WARN` untuk status 415 dan satu log `ERROR` untuk status 500.
4. Tulis tiga field tambahan yang berguna untuk diagnosis upload, lalu jelaskan alasannya.
5. Periksa log yang kamu buat. Apakah ada data sensitif yang seharusnya tidak dicatat?
6. Tantangan: buat fungsi `withTiming(event, fn)` yang mencatat `duration_ms` dan error secara otomatis.

---

## Referensi

- [OpenTelemetry Logs Data Model](https://opentelemetry.io/docs/specs/otel/logs/data-model/)
- [OpenTelemetry JavaScript: Logs SDK](https://www.npmjs.com/package/@opentelemetry/sdk-logs)
- [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)

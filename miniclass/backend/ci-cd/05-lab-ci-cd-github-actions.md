# Lab: Pipeline CI/CD Pertama dengan GitHub Actions

::: info **Prasyarat Modul**
Kamu sudah paham alur *pipeline* dari Halaman 1, strategi *deploy* dari Halaman 2, dan pembatasan hak akses dari Halaman 4. Kamu juga sudah bisa menulis Dockerfile dari modul Docker. Halaman ini praktik pertama yang mengikat semuanya.
:::


Target kita di lab ini sederhana: setiap kali kamu `push` ke *branch* `main`, *pipeline* akan otomatis menjalankan *test*, membungkusnya menjadi *image* Docker bertag SHA, menayangkan situsnya ke alamat publik, lalu memverifikasi bahwa versi baru benar-benar sudah tampil.

Alur *pipeline*-nya terbagi menjadi dua bagian utama seperti yang sudah kita bahas di Halaman 1:

| Bagian | Pertanyaan yang Dijawab | Job di Lab Ini |
| :--- | :--- | :--- |
| **CI (Continuous Integration)** | Apakah kodenya valid dan bisa dibangun menjadi *artifact*? | `test` dan `image` |
| **CD (Continuous Deployment)** | Apakah versi yang lolos sudah benar-benar sampai ke pengunjung? | `deploy` |

Urutannya bersifat mutlak: `deploy` hanya akan berjalan jika `test` dan `image` sama-sama hijau. Kalau salah satunya merah, proses berhenti di pintu dan pengunjung tetap dilayani oleh versi lama.

Satu *commit* di sini menghasilkan dua keluaran sekaligus dari kode yang persis sama: situs web yang tayang di GitHub Pages, serta *image* di *registry* yang sudah terbukti hidup dan siap dijalankan di mana saja.

---
## Langkah 1 · Siapkan Kode dan Script Test

Buat repositori **publik** baru di GitHub, misalnya `cicd-demo` *(pada paket GitHub Free, GitHub Pages umumnya membutuhkan repositori publik; cek dokumentasi GitHub Pages jika ingin memakai repositori privat)*.

Susun struktur folder dan file di laptopmu seperti ini:

```text
cicd-demo/
├── site/
│   └── index.html
├── test.sh
├── Dockerfile
└── .github/
    └── workflows/
        └── ci-cd.yml
```


### 1. Halaman Situs (`site/index.html`)

Nomor versi di dalam halaman ini bertindak sebagai *single source of truth*—dari sinilah *pipeline* membaca versi rilis yang diharapkan:

```html
<!doctype html>
<meta charset="utf-8">
<title>Situs CI/CD</title>
<h1>Halo dari pipeline</h1>
<p>v1.0.0</p>
```

### 2. Script Pengujian (`test.sh`)

*Test* sederhana ini akan gagal jika file halaman tidak ditemukan, tidak memiliki tag `<title>`, atau tidak mencantumkan format versi `vX.Y.Z`:

```sh
#!/bin/sh
# Test sederhana: halaman harus ada, punya judul, dan menyebut versi vX.Y.Z.
set -eu

gagal() { echo "GAGAL: $1" >&2; exit 1; }

[ -f site/index.html ] || gagal "site/index.html tidak ada"
grep -q '<title>' site/index.html || gagal "site/index.html tidak punya <title>"

versi=$(grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' site/index.html | head -n 1 || true)
[ -n "$versi" ] || gagal "site/index.html harus menyebut versi, contoh: v1.0.0"

echo "OK: semua cek lolos, versi $versi"
```

Biasakan cek dulu di laptop sebelum `push` agar kamu tidak membuang waktu menunggu *runner* hanya karena salah ketik:

```sh
sh test.sh
```
---

## Langkah 2 · Buat Dockerfile

Isi file `Dockerfile` di *root* repositori dengan konfigurasi berikut:

```dockerfile
FROM busybox:1.37
COPY site/index.html /www/index.html
USER 65534:65534
EXPOSE 8080
CMD ["httpd", "-f", "-p", "8080", "-h", "/www"]
```

Beberapa detail penting yang sengaja kita pasang di sini:

- **`busybox:1.37`:** *Base image* yang super ringan, dan utilitas `httpd` bawaannya sudah cukup untuk menyajikan halaman statis.
- **`USER 65534:65534`:** Memastikan proses web tidak berjalan sebagai `root` di dalam *container*.
- **Port `8080`:** Dipilih di atas port `1024` agar proses *non-root* bisa membukanya tanpa hak istimewa khusus.
- **Tag versi:** `busybox:1.37` dipakai di sini agar tetap ringkas untuk latihan; untuk lingkungan produksi, pastikan selalu di-*pin* ke *digest* (ingat kembali catatan di Halaman 1).

---
## Langkah 3 · Aktifkan GitHub Pages

Lakukan pengaturan ini **satu kali saja** sebelum *push* pertama:

1. Buka repositori `cicd-demo` di GitHub.
2. Masuk ke menu **Settings** -> **Pages**.
3. Pada bagian **Build and deployment**, ubah opsi **Source** menjadi **GitHub Actions**.

Dengan pengaturan ini, *workflow* kitalah yang memegang kendali penuh atas proses penayangan situs, bukan mekanisme *build* otomatis bawaan GitHub dari sebuah *branch*.

---
## Langkah 4 · Susun Workflow CI/CD

Buat file `.github/workflows/ci-cd.yml`. Baca komentarnya per bagian agar paham fungsi tiap blok:

```yaml
name: ci-cd

on:
  push:
    branches: [main]

# Default: hanya boleh membaca. Job yang butuh lebih harus memintanya sendiri.
permissions:
  contents: read

# Satu deploy Pages pada satu waktu, dan jangan batalkan deploy yang sedang berjalan.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # CI: apakah kodenya benar? Kalau lolos, siapkan paket situs untuk Pages.
  test:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.ver.outputs.value }}
    steps:
      - uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6
      - name: Jalankan test
        run: sh test.sh
      - name: Baca versi dari halaman
        id: ver
        run: |
          v=$(grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' site/index.html | head -n 1)
          echo "value=$v" >> "$GITHUB_OUTPUT"
      - name: Siapkan paket situs untuk Pages
        uses: actions/upload-pages-artifact@7b1f4a764d45c48632c6b24a0339c27f5614fb0b # v4
        with:
          path: site

  # CI: bangun image, dorong ke registry, lalu buktikan image itu hidup.
  image:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6
      - id: meta
        uses: docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302 # v6
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,format=long
      - uses: docker/login-action@8aa5831fb8d48d8f76594c7ddde61ae58019f550 # v4
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 # v4
      - id: build
        uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
      - name: Jalankan image yang baru didorong, pastikan menampilkan versi yang benar
        env:
          IMAGE: ghcr.io/${{ github.repository }}
          DIGEST: ${{ steps.build.outputs.digest }}
          EXPECTED: ${{ needs.test.outputs.version }}
        run: |
          image="${IMAGE,,}@${DIGEST}"
          docker run -d --name uji -p 8080:8080 "$image"
          for _ in $(seq 1 15); do
            if curl --silent --max-time 2 http://localhost:8080/ | grep -qF "$EXPECTED"; then
              echo "OK: image menampilkan $EXPECTED"
              {
                echo "### Image $EXPECTED terbukti hidup"
                echo
                echo "\`$image\`"
              } >> "$GITHUB_STEP_SUMMARY"
              exit 0
            fi
            sleep 1
          done
          docker logs uji >&2
          echo "Image tidak menampilkan $EXPECTED" >&2
          exit 1

  # CD: tayangkan situs. Hanya job ini yang memegang hak menulis ke Pages.
  deploy:
    needs: [test, image]
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Tayangkan ke GitHub Pages
        id: deployment
        uses: actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e # v4

      - name: Tunggu sampai versi baru benar-benar tayang
        env:
          SITE_URL: ${{ steps.deployment.outputs.page_url }}
          EXPECTED: ${{ needs.test.outputs.version }}
        run: |
          # "Deploy selesai" belum berarti pengunjung sudah melihat versi baru.
          # Kita cek sendiri dari luar sampai halaman menyebut versi yang diharapkan.
          for _ in $(seq 1 30); do
            if curl --silent --max-time 5 "${SITE_URL}?cek=${RANDOM}" | grep -qF "$EXPECTED"; then
              echo "OK: $EXPECTED sudah tayang di $SITE_URL"
              echo "### ✅ $EXPECTED tayang di $SITE_URL" >> "$GITHUB_STEP_SUMMARY"
              exit 0
            fi
            sleep 4
          done
          echo "Versi $EXPECTED tidak muncul dalam 2 menit di $SITE_URL" >&2
          exit 1
```
### Bedah Bagian Penting Workflow

| Bagian | Kenapa Ada? |
| :--- | :--- |
| `permissions: contents: read` di level atas | Menerapkan prinsip keamanan Halaman 4: secara *default* seluruh *workflow* hanya punya hak baca. *Job* yang butuh hak tulis wajib memintanya secara eksplisit. |
| `packages: write` di `image`; `pages: write` & `id-token: write` di `deploy` | Isolasi hak akses—*job* `test` yang mengeksekusi skrip dari repositori tidak memegang izin tulis apa pun. |
| `needs: test` lalu `needs: [test, image]` | Rantai ketergantungan berurutan: *image* tidak dibangun jika *test* gagal, dan situs tidak ditayangkan jika *image* bermasalah. |
| `upload-pages-artifact` di *job* `test` | Paket statis situs dikemas tepat setelah *test* lolos, dari dalam *job* yang berstatus *read-only*. |
| `type=sha,format=long` | Menandai *image* dengan SHA *commit* lengkap berawalan `sha-` *(bentuk default `metadata-action` hanya 7 karakter, sehingga `format=long` mencegah ambiguitas)*. |
| `images: ghcr.io/...` *(dari konteks `github.repository`)* | Nama *image* otomatis mengikuti nama repositori dan dikonversi menjadi huruf kecil oleh `metadata-action` agar tidak memicu *error* huruf kapital. |
| Langkah *"Jalankan image yang baru didorong"* | *Smoke test* pasca-*push*: *runner* menarik kembali *image* dari *registry* memakai *digest*, menjalankannya, dan memastikan respons HTTP-nya menampilkan nomor versi yang diharapkan. |
| `environment: github-pages` dengan `url` | Mencatat riwayat setiap rilis di tab **Environments** repositori lengkap dengan tautan langsung ke situs yang tayang. |
| `concurrency: group: pages` | Mencegah dua `push` beruntun saling menimpa di tengah proses *deployment* berlangsung. |
| Langkah *"Tunggu sampai versi baru benar-benar tayang"* | Status *deploy* selesai di API belum tentu berarti CDN sudah menyajikan halaman baru. Parameter `?cek=...` memaksa pengecekan langsung dari luar tanpa terhalang *cache*. |

Perhatikan juga bahwa *pipeline* ini **tidak menyimpan *secret* jangka panjang apa pun**—ia hanya memanfaatkan `GITHUB_TOKEN` sementara yang otomatis hangus begitu *job* selesai.

---
## Langkah 5 · Push dan Amati Hasilnya

Inisialisasi Git di folder proyekmu, lalu dorong ke GitHub:

```sh
git init -b main && git add . && git commit -m "versi pertama v1.0.0"
git remote add origin https://github.com/<username>/cicd-demo.git
git push -u origin main
```

Buka tab **Actions** di repositorimu dan perhatikan tiga *job* (`test`, `image`, `deploy`) berjalan berurutan.

### Checkpoint Verifikasi

Pastikan kelima poin ini terpenuhi sebelum lanjut ke langkah berikutnya:

- [ ] *Job* `test` berwarna hijau dan mencetak `OK: semua cek lolos, versi v1.0.0`.
- [ ] *Job* `image` berwarna hijau (termasuk langkah *"Jalankan image yang baru didorong"*), dan ringkasannya menampilkan alamat *image* lengkap dengan `@sha256:...`.
- [ ] *Job* `deploy` berwarna hijau, dan ringkasannya menampilkan `✅ v1.0.0 tayang di ...`.
- [ ] Alamat `https://<username>.github.io/cicd-demo/` sudah menampilkan `v1.0.0`.
- [ ] Di halaman utama repositori, bagian **Deployments** menampilkan status aktif untuk `github-pages`.

---

## Langkah 6 · Uji Skenario Sukses dan Gagal

### 1. Naikkan Versi (`v1.1.0`)

Ubah teks `v1.0.0` menjadi `v1.1.0` di dalam `site/index.html`, lalu `commit` dan `push`:

```sh
git commit -am "versi v1.1.0" && git push
```

Tunggu hingga ketiga *job* selesai hijau, lalu *refresh* halaman situsmu. Inilah esensi **Continuous Deployment**: kode di `main` meluncur sampai ke pengunjung tanpa satu pun tombol manual ditekan.

### 2. Coba Rusakkan Kode

Sekarang uji skenario sebaliknya: hapus baris `<title>Situs CI/CD</title>` dari `site/index.html`, lalu `push` ke `main`.

- *Job* `test` akan langsung merah.
- *Job* `image` dan `deploy` otomatis dilewati (*skipped*).
- Buka kembali halaman situsmu: versi `v1.1.0` tetap tayang tanpa gangguan.

Inilah tujuan utama *pipeline* kita: perubahan yang rusak tertahan di gerbang awal dan tidak pernah menyentuh pengunjung.

---
## Langkah 7 · Rollback via Git Revert

Jika versi yang sudah terlanjur tayang ternyata bermasalah, cara *rollback* yang paling aman dan meninggalkan jejak audit yang jelas adalah membatalkan *commit* bermasalah tersebut lalu membiarkan *pipeline* menayangkan ulang versi sebelumnya:

```sh
git revert HEAD --no-edit
git push
```

*Pipeline* akan berjalan seperti biasa melewati seluruh gerbang pengujian, sementara riwayat Git mencatat secara transparan versi mana yang dibatalkan dan mengapa versi lama kembali naik.

---

## Langkah 8 · Jalankan Image di Laptop (Opsional)

Jika laptopmu terpasang Docker, kamu bisa menjalankan *artifact* hasil *build* dari *job* `image` secara lokal:

1. Salin alamat *image* beserta *digest*-nya dari ringkasan *job* `image` di tab **Actions**.
2. Karena paket baru di GHCR secara *default* berstatus privat, ubah visibilitasnya menjadi **Public** lewat **Package settings** *(aman karena lab ini tidak menyimpan rahasia)*, atau jalankan `docker login ghcr.io` terlebih dahulu.
3. Jalankan *container* memakai *digest* persisnya:

```sh
docker run -d --name situs -p 8080:8080 ghcr.io/<username>/cicd-demo@sha256:<digest-v1.1.0>
curl http://localhost:8080/      # menampilkan v1.1.0
```

Untuk *"kembali ke versi lama"* di lokal, kamu cukup menjalankan `docker run` menggunakan *digest* dari ringkasan eksekusi `v1.0.0` sebelumnya—tanpa perlu *build* ulang sama sekali, karena *image* bertag SHA yang dipanggil lewat *digest* tidak pernah tertimpa. Bandingkan dengan tag `:latest` yang membuat proses kembali ke versi kemarin menjadi tebak-tebakan.

> Pola inilah gambaran nyata *deploy* ke server produksi: pengirim cukup mengirimkan rujukan versi yang pasti (*digest*), dan penerima menjalankannya. Bagaimana cara menjaga pintu penerima di server agar hanya mau menjalankan perintah yang sah, itulah yang dibahas di Halaman 4.

---

## Tabel Jebakan

| Gejala | Penyebab Umum | Solusi |
| :--- | :--- | :--- |
| *Job* `deploy` gagal dengan pesan Pages belum aktif | Pengaturan *Source* Pages belum diubah ke GitHub Actions | Ulangi Langkah 3: **Settings** -> **Pages** -> **Source: GitHub Actions**. |
| *Job* `deploy` gagal karena masalah izin / token | Blok `permissions` di *job* `deploy` kurang lengkap | Pastikan `pages: write` dan `id-token: write` tertulis di *job* `deploy`. |
| Muncul `denied: permission_denied` saat *push image* | *Job* `image` tidak memiliki hak tulis ke *packages* | Tambahkan `packages: write` pada blok `permissions` di *job* `image`. |
| *Workflow* tidak berjalan sama sekali | Lokasi folder salah, salah indentasi YAML, atau *push* bukan ke `main` | Cek struktur `.github/workflows/` dan validasi YAML dengan `actionlint`. |
| *Pipeline* hijau tapi halaman masih versi lama | *Cache* browser lokal atau isi `site/index.html` belum berubah | Lakukan *hard refresh* (`Ctrl+Shift+R`) dan cek log langkah *"Tunggu sampai versi baru benar-benar tayang"*. |
| Langkah *"Jalankan image"* gagal | Nomor versi tidak cocok atau jalur `COPY` di `Dockerfile` keliru | Periksa output `docker logs uji` yang otomatis dicetak saat langkah gagal. |
| `docker run` di laptop gagal (`unauthorized` / `denied`) | *Package* GHCR masih berstatus privat | Ubah visibilitas *package* ke **Public**, atau jalankan `docker login ghcr.io`. |
| *Test* gagal padahal halaman terlihat normal | `site/index.html` kehilangan `<title>` atau format versi `vX.Y.Z` | Baca pesan spesifik setelah kata `GAGAL:` pada log *job* `test`. |

---

## Latihan

1. **Uji gerbang gagal:** Hapus tag `<title>` di `site/index.html` lalu `push`. Apa yang terjadi pada *job* `image` dan `deploy`, dan mengapa perilaku ini penting dalam *pipeline*?
2. **Identitas *artifact*:** Jelaskan dua alasan dari Halaman 1 mengapa *image* di lab ini diberi *tag* `sha-...` panjang dan dipanggil lewat *digest*, bukan `:latest`.
3. **Bandingkan waktu pemulihan:** Lakukan *rollback* memakai `git revert` dan catat berapa lama waktu yang dibutuhkan hingga versi lama tayang kembali di Pages. Bandingkan kecepatannya dengan menjalankan *digest* lama langsung lewat Docker di laptopmu.
4. **Isolasi *Pull Request*:** Tambahkan `pull_request` pada blok `on:` agar *job* `test` ikut berjalan saat ada PR masuk, namun pastikan `image` dan `deploy` **tidak** berjalan pada PR *(petunjuk: gunakan kondisi `if: github.event_name == 'push'`)*. Mengapa *job* dengan hak tulis tidak boleh dieksekusi dari PR orang luar?
5. **Tantangan — Persetujuan manusia:** Buka **Settings** -> **Environments** -> `github-pages` dan aktifkan **Required reviewers** untuk akunmu sendiri, lalu `push` versi baru. Apa yang terjadi pada *job* `deploy`? *(Ini adalah praktik nyata untuk memisahkan Continuous Delivery dan Continuous Deployment).*
6. **Tantangan — Eksekusi paralel:** Tambahkan satu *job* baru bernama `lint` yang berjalan paralel bersamaan dengan `test`, lalu atur agar *job* `image` menunggu keduanya selesai sebelum mulai berjalan.

---

## Referensi

- [`actions/deploy-pages`](https://github.com/actions/deploy-pages)
- [`actions/upload-pages-artifact`](https://github.com/actions/upload-pages-artifact)
- [GitHub Docs: *Using custom workflows with GitHub Pages*](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [`docker/metadata-action`](https://github.com/docker/metadata-action)
- [`docker/build-push-action`](https://github.com/docker/build-push-action)
- [Docker Docs: *GitHub Actions*](https://docs.docker.com/guides/gha/)
- [GitHub Docs: *Working with the Container registry*](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Docs: *Controlling permissions for `GITHUB_TOKEN`*](https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token)